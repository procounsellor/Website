import { dehydrate, hydrate } from "@tanstack/react-query";
import { IS_PRERENDER } from "@/lib/clientReady";
import { queryClient } from "@/lib/queryClient";

/**
 * Makes react-snap's saved HTML look like a server render, so hydrateRoot can
 * adopt it instead of throwing it away.
 *
 * react-snap saves the DOM of a *client* render. A server render additionally
 * writes two kinds of comments that hydration relies on, and without them
 * hydrateRoot failed on every page (#418) and rebuilt it from scratch:
 *
 *  1. Suspense boundaries are wrapped in <!--$--> … <!--/$-->. Hydration
 *     looks for that marker the moment it reaches a <Suspense>.
 *  2. Adjacent text nodes (`{label} →` renders two) are separated by
 *     <!-- -->; serialised without it they merge into one text node.
 *  3. Radix Select's first render differs from what is on screen later (an
 *     empty label, plus a hidden native <select>); the snapshot is put back
 *     to that first render.
 *  4. Data fetched while rendering is sent along with the HTML, so the first
 *     browser render has it too (a college page otherwise rendered
 *     "Loading…" over the prerendered college and failed to hydrate).
 *
 * react-snap calls window.snapSaveState() just before it saves each page; that
 * is where both are added. Nothing is added to the React tree itself, so the
 * component tree (and every useId) is identical in prerender and browser.
 */

type Fiber = {
  tag: number;
  child: Fiber | null;
  sibling: Fiber | null;
  return: Fiber | null;
  stateNode: unknown;
  memoizedState: unknown;
};

// React work tags (react-reconciler/src/ReactWorkTags).
const HOST_ROOT = 3;
const HOST_PORTAL = 4;
const HOST_COMPONENT = 5;
const HOST_TEXT = 6;
const SUSPENSE = 13;
const HOST_HOISTABLE = 26;
const HOST_SINGLETON = 27;

const isHost = (f: Fiber) => f.tag === HOST_COMPONENT || f.tag === HOST_TEXT || f.tag === HOST_SINGLETON;

/** Top-level DOM nodes rendered under `first` and its siblings (not crossing portals). */
function hostNodes(first: Fiber | null, out: Node[] = []): Node[] {
  for (let f = first; f; f = f.sibling) {
    if (f.tag === HOST_PORTAL || f.tag === HOST_HOISTABLE) continue;
    if (isHost(f)) out.push(f.stateNode as Node);
    else hostNodes(f.child, out);
  }
  return out;
}

/** The DOM parent a fiber's output is inserted into. */
function hostParent(f: Fiber): Node | null {
  for (let p = f.return; p; p = p.return) {
    if (p.tag === HOST_COMPONENT || p.tag === HOST_SINGLETON) return p.stateNode as Node;
    if (p.tag === HOST_ROOT) return (p.stateNode as { containerInfo: Node }).containerInfo;
    if (p.tag === HOST_PORTAL) return null;
  }
  return null;
}

/** First DOM node rendered after `f` inside the same DOM parent (null = at the end). */
function nextHostSibling(f: Fiber): Node | null {
  let node: Fiber = f;
  for (;;) {
    while (!node.sibling) {
      const up = node.return;
      if (!up || up.tag === HOST_COMPONENT || up.tag === HOST_SINGLETON || up.tag === HOST_ROOT || up.tag === HOST_PORTAL) return null;
      node = up;
    }
    node = node.sibling;
    if (node.tag === HOST_PORTAL) continue;
    const first = isHost(node) ? (node.stateNode as Node) : hostNodes(node.child)[0];
    if (first) return first;
  }
}

export function markSuspenseBoundaries(container: Element): number {
  const key = Object.keys(container).find((k) => k.startsWith("__reactContainer$"));
  if (!key) return 0;
  const root = (container as unknown as Record<string, Fiber>)[key];
  let count = 0;
  const visit = (first: Fiber | null) => {
    for (let f = first; f; f = f.sibling) {
      if (f.tag === SUSPENSE) {
        const parent = hostParent(f);
        if (parent) {
          // Resolved boundary: "$". One still showing its fallback: "$!" tells
          // React to render that boundary on the client instead of adopting it.
          const open = document.createComment(f.memoizedState === null ? "$" : "$!");
          const close = document.createComment("/$");
          const nodes = hostNodes(f.child);
          if (nodes.length) {
            nodes[0].parentNode?.insertBefore(open, nodes[0]);
            const last = nodes[nodes.length - 1];
            last.parentNode?.insertBefore(close, last.nextSibling);
          } else {
            // Rendered nothing: the markers still go where its output would be.
            const before = nextHostSibling(f);
            parent.insertBefore(open, before);
            parent.insertBefore(close, before);
          }
          count++;
        }
      }
      if (f.tag !== HOST_PORTAL) visit(f.child);
    }
  };
  visit(root.child);
  return count;
}

/**
 * Radix Select writes the selected option's label into <SelectValue> through a
 * portal *after* mount, so a browser's first render has an empty label while
 * the snapshot has the text. Clear those labels (only where a value is
 * selected; a placeholder is part of the first render and stays).
 */
export function clearPortalledSelectLabels(root: Element): number {
  const labels = root.querySelectorAll('button[role="combobox"]:not([data-placeholder]) [data-slot="select-value"]');
  labels.forEach((el) => {
    el.textContent = "";
  });
  return labels.length;
}

type SelectProviderProps = {
  onTriggerChange?: unknown;
  onValueNodeHasChildrenChange?: unknown;
  value?: string;
  required?: boolean;
  disabled?: boolean;
};

/**
 * Radix Select renders a hidden native <select> (for form submission) on its
 * first render, then drops it once mounted if the trigger is not inside a
 * <form>. The snapshot is taken after that, so it lacks the <select> the
 * browser's first render has. Put it back exactly where Radix rendered it:
 * right after the Select's own output.
 */
export function restoreSelectBubbleInputs(container: Element): number {
  const key = Object.keys(container).find((k) => k.startsWith("__reactContainer$"));
  if (!key) return 0;
  const root = (container as unknown as Record<string, Fiber>)[key];
  let count = 0;
  const visit = (first: Fiber | null) => {
    for (let f = first; f; f = f.sibling) {
      const props = (f as Fiber & { memoizedProps?: SelectProviderProps }).memoizedProps;
      if (
        props &&
        typeof props === "object" &&
        typeof props.onTriggerChange === "function" &&
        typeof props.onValueNodeHasChildrenChange === "function"
      ) {
        const nodes = hostNodes(f.child);
        const last = nodes[nodes.length - 1];
        // Inside a <form> the <select> stays, but by now it holds an <option>
        // per item, added after mount. Its first render had none.
        if (last && last.nodeName === "SELECT") {
          const select = last as HTMLSelectElement;
          select.replaceChildren();
          if (props.value === undefined) {
            const option = document.createElement("option");
            option.value = "";
            select.appendChild(option);
          }
          count++;
        } else if (last && last.parentNode) {
          let rootProps: { name?: string; autoComplete?: string } = {};
          for (let p = f.return; p; p = p.return) {
            const t = (p as Fiber & { type?: unknown }).type as ((() => unknown) & { displayName?: string }) | null;
            if (typeof t === "function" && t.displayName === "Select") {
              rootProps = (p as Fiber & { memoizedProps: typeof rootProps }).memoizedProps;
              break;
            }
          }
          const select = document.createElement("select");
          select.setAttribute("aria-hidden", "true");
          select.setAttribute("tabindex", "-1");
          if (props.required) select.setAttribute("required", "");
          if (props.disabled) select.setAttribute("disabled", "");
          if (rootProps.name) select.setAttribute("name", rootProps.name);
          if (rootProps.autoComplete) select.setAttribute("autocomplete", rootProps.autoComplete);
          // @radix-ui/react-visually-hidden's VISUALLY_HIDDEN_STYLES.
          select.style.cssText =
            "position:absolute;border:0;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;word-wrap:normal";
          // First render: no options yet, plus an empty one when nothing is selected.
          if (props.value === undefined) {
            const option = document.createElement("option");
            option.value = "";
            select.appendChild(option);
          }
          last.parentNode.insertBefore(select, last.nextSibling);
          count++;
        }
      }
      if (f.tag !== HOST_PORTAL) visit(f.child);
    }
  };
  visit(root.child);
  return count;
}

export function separateAdjacentText(root: Node): number {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const pairs: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.previousSibling?.nodeType === Node.TEXT_NODE) pairs.push(n as Text);
  }
  for (const text of pairs) text.parentNode?.insertBefore(document.createComment(" "), text);
  return pairs.length;
}

const QUERY_STATE_KEY = "__PC_QUERY_STATE__";

/**
 * Before hydrating: load the React Query data the prerender saved with the page.
 * It keeps its build-time timestamp, so it is stale and refetched after hydration.
 */
export function restorePrerenderedQueries(): void {
  const state = (window as unknown as Record<string, unknown>)[QUERY_STATE_KEY];
  if (state) hydrate(queryClient, state);
}

export function installPrerenderSnapshotHook(): void {
  if (!IS_PRERENDER) return;
  (window as Window & { snapSaveState?: () => Record<string, unknown> }).snapSaveState = () => {
    const root = document.getElementById("root");
    if (root) {
      clearPortalledSelectLabels(root);
      const boundaries = markSuspenseBoundaries(root);
      // After the boundary markers, so a <select> lands inside its boundary.
      restoreSelectBubbleInputs(root);
      const separators = separateAdjacentText(root);
      root.setAttribute("data-prerender-markers", `${boundaries}/${separators}`);
    }
    // Data actually fetched during the render (queries seeded from the bundled
    // snapshots, initialDataUpdatedAt: 0, are already in the JS), plus requests
    // that failed: the API is blocked while prerendering, so the page shows its
    // error/empty state and the browser must start from the same state. Both
    // keep their build-time timestamps, so they are refetched after hydration.
    const state = dehydrate(queryClient, {
      shouldDehydrateQuery: (q) =>
        (q.state.status === "success" && q.state.dataUpdatedAt > 0) || q.state.status === "error",
    });
    return state.queries.length ? { [QUERY_STATE_KEY]: state } : {};
  };
}
