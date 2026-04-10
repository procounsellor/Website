import { useMemo, useState } from "react";

type SubmittedResultBase = {
  serialNo: number;
  fullName: string;
  emailId: string;
  physics: number;
  chemistry: number;
  mathematics: number;
  total: number;
  rank?: number;
};

type SubmittedResult = SubmittedResultBase & {
  normalizedName: string;
  normalizedPhone: string;
};

type StartedNotSubmitted = {
  serialNo: number;
  fullName: string;
  emailId: string;
};

const SUBMITTED_RESULTS_RAW: SubmittedResultBase[] = [
  { serialNo: 1, fullName: "Sushant Zunje", emailId: "+919730158043@examin8.com", physics: 48.75, chemistry: 50.0, mathematics: 97.5, total: 196.25 },
  { serialNo: 2, fullName: "Kashish Sayyad", emailId: "+919022091611@examin8.com", physics: 47.5, chemistry: 50.0, mathematics: 92.5, total: 190.0 },
  { serialNo: 3, fullName: "Vikas Chaudhari", emailId: "+918080671935@examin8.com", physics: 46.25, chemistry: 50.0, mathematics: 92.5, total: 188.75 },
  { serialNo: 4, fullName: "Viraj Lahoti", emailId: "+917666499062@mycbseguide.com", physics: 48.75, chemistry: 47.5, mathematics: 92.5, total: 188.75 },
  { serialNo: 5, fullName: "Adinath Pacharne", emailId: "+919307764027@examin8.com", physics: 45.0, chemistry: 50.0, mathematics: 92.5, total: 187.5 },
  { serialNo: 6, fullName: "Anshul Zade", emailId: "anshulzadebro@gmail.com", physics: 47.5, chemistry: 50.0, mathematics: 90.0, total: 187.5 },
  { serialNo: 7, fullName: "Bhumi Takalkar", emailId: "+919325196109@examin8.com", physics: 46.25, chemistry: 48.75, mathematics: 92.5, total: 187.5 },
  { serialNo: 8, fullName: "Vaishnavi Hembade", emailId: "+917218118744@examin8.com", physics: 50.0, chemistry: 50.0, mathematics: 85.0, total: 185.0 },
  { serialNo: 9, fullName: "Pradyumna Babar", emailId: "pradyumna081102@gmail.com", physics: 47.5, chemistry: 46.5, mathematics: 90.5, total: 184.5 },
  { serialNo: 10, fullName: "Prathamesh Bawankar", emailId: "+919209487601@examin8.com", physics: 45.0, chemistry: 46.25, mathematics: 92.5, total: 183.75 },
  { serialNo: 11, fullName: "Tanushri Sarda", emailId: "+919699789200@examin8.com", physics: 46.25, chemistry: 47.5, mathematics: 87.5, total: 181.25 },
  { serialNo: 12, fullName: "Sakshi Mane", emailId: "divinegirl660@gmail.com", physics: 42.5, chemistry: 45.0, mathematics: 90.0, total: 177.5 },
  { serialNo: 13, fullName: "Bhavika Mhaske", emailId: "bhavikamhaske08@gmail.com", physics: 46.25, chemistry: 48.75, mathematics: 80.0, total: 175.0 },
  { serialNo: 14, fullName: "Pratik Bonage", emailId: "+917066773423@examin8.com", physics: 39.25, chemistry: 42.5, mathematics: 87.5, total: 169.25 },
  { serialNo: 15, fullName: "Rushikesh Pote", emailId: "+918956488650@examin8.com", physics: 38.75, chemistry: 42.5, mathematics: 82.5, total: 163.75 },
  { serialNo: 16, fullName: "Monika Rayshedam", emailId: "+917888167780@examin8.com", physics: 45.0, chemistry: 46.25, mathematics: 67.5, total: 158.75 },
  { serialNo: 17, fullName: "Harsh Singh", emailId: "+919305142198@examin8.com", physics: 40.0, chemistry: 41.25, mathematics: 70.5, total: 151.75 },
  { serialNo: 18, fullName: "Tanvi Dahimiwal", emailId: "+919172949437@examin8.com", physics: 43.75, chemistry: 38.75, mathematics: 65.0, total: 147.5 },
  { serialNo: 19, fullName: "Lavanya Thakare", emailId: "+919307437169@examin8.com", physics: 35.0, chemistry: 33.75, mathematics: 75.0, total: 143.75 },
  { serialNo: 20, fullName: "Sonakshi Parshivnikar", emailId: "+919376105201@examin8.com", physics: 19.0, chemistry: 20.0, mathematics: 82.5, total: 121.5 },
  { serialNo: 21, fullName: "Viki Ambhore", emailId: "ambhoreviki9@gmail.com", physics: 13.75, chemistry: 33.75, mathematics: 65.0, total: 112.5 },
  { serialNo: 22, fullName: "Nil Jadhav", emailId: "+919405189707@examin8.com", physics: 33.75, chemistry: 22.5, mathematics: 50.0, total: 106.25 },
  { serialNo: 23, fullName: "Prisha Rathod", emailId: "punyarathod123@gmail.com", physics: 20.0, chemistry: 33.75, mathematics: 37.5, total: 91.25 },
  { serialNo: 24, fullName: "Supriya Darade", emailId: "+917709761448@examin8.com", physics: 20.0, chemistry: 23.75, mathematics: 40.0, total: 83.75 },
  { serialNo: 25, fullName: "Vaidehi K", emailId: "+919987440519@examin8.com", physics: 21.25, chemistry: 21.25, mathematics: 27.5, total: 70.0 },
  { serialNo: 26, fullName: "Sanskar Nagarnaik", emailId: "+918459475949@examin8.com", physics: 11.5, chemistry: 19.0, mathematics: 37.0, total: 67.5 },
  { serialNo: 27, fullName: "Shivam Dalvi", emailId: "+917058023632@examin8.com", physics: 46.25, chemistry: 13.25, mathematics: 0.0, total: 59.5 },
  { serialNo: 28, fullName: "Shreya Jadhav", emailId: "+919067511670@examin8.com", physics: 16.5, chemistry: 0.0, mathematics: 17.5, total: 34.0 },
  { serialNo: 29, fullName: "Yadnesh Pathak", emailId: "+918788823093@examin8.com", physics: 19.0, chemistry: 6.75, mathematics: 8.0, total: 33.75 },
  { serialNo: 30, fullName: "Nayenshi Singh", emailId: "+917718070884@examin8.com", physics: 20.0, chemistry: 3.75, mathematics: 7.5, total: 31.25 },
  { serialNo: 31, fullName: "Neha Kore", emailId: "+919699028824@examin8.com", physics: 10.0, chemistry: 10.0, mathematics: 10.0, total: 30.0 },
  { serialNo: 32, fullName: "Suyash", emailId: "suyashmeshram838@gmail.com", physics: 7.5, chemistry: 10.0, mathematics: 0.0, total: 17.5 },
  { serialNo: 33, fullName: "Janhavi Ingole", emailId: "+919146626693@examin8.com", physics: 11.25, chemistry: 1.25, mathematics: 3.5, total: 16.0 },
  { serialNo: 34, fullName: "Vaishnavi Phundipalle", emailId: "+918087969083@examin8.com", physics: 5.25, chemistry: 8.0, mathematics: 2.0, total: 15.25 },
  { serialNo: 35, fullName: "Gauravi Birajdar", emailId: "+919209166060@examin8.com", physics: 2.5, chemistry: 7.5, mathematics: 2.5, total: 12.5 },
  { serialNo: 36, fullName: "Chinmay Ghag", emailId: "+918369586272@examin8.com", physics: 2.0, chemistry: 6.25, mathematics: 2.5, total: 10.75 },
  { serialNo: 37, fullName: "Sameer Adhau", emailId: "+919309177893@examin8.com", physics: -3.75, chemistry: 4.0, mathematics: 7.5, total: 7.75 },
  { serialNo: 38, fullName: "Shardul Gavali", emailId: "+917385415778@mycbseguide.com", physics: -0.25, chemistry: 0.0, mathematics: 0.0, total: -0.25 },
  { serialNo: 39, fullName: "Gayatri Patil", emailId: "+917058072173@examin8.com", physics: 0.0, chemistry: -1.25, mathematics: -10.0, total: -11.25 },
  { serialNo: 40, fullName: "Yash Dole", emailId: "+917240140209@examin8.com", physics: 37.5, chemistry: 43.75, mathematics: 92.5, total: 173.75 },
  { serialNo: 41, fullName: "Jidnya Patil", emailId: "+918530523907@examin8.com", physics: 42.5, chemistry: 37.5, mathematics: 90.0, total: 170.0 },
  { serialNo: 42, fullName: "Manthan Bhosale", emailId: "+918591500598@examin8.com", physics: 27.5, chemistry: 37.25, mathematics: 69.0, total: 133.75 },
  { serialNo: 43, fullName: "Chinmay Ghag", emailId: "+918369586272@examin8.com", physics: 22.5, chemistry: 33.75, mathematics: 35.0, total: 91.25 },
  { serialNo: 44, fullName: "Shreyash Yadav", emailId: "+919766287401@examin8.com", physics: 22.5, chemistry: 18.75, mathematics: 40.0, total: 81.25 },
  { serialNo: 45, fullName: "Aditya Itkar", emailId: "+919923235739@examin8.com", physics: 22.5, chemistry: 17.5, mathematics: 40.0, total: 80.0 },
  { serialNo: 46, fullName: "Srushti Somwanshi", emailId: "+918805734052@examin8.com", physics: 22.5, chemistry: 27.5, mathematics: 12.5, total: 62.5 },
  { serialNo: 47, fullName: "Samiksha Misal", emailId: "+919610702092@examin8.com", physics: 3.25, chemistry: 17.75, mathematics: 19.5, total: 40.5 },
  { serialNo: 48, fullName: "Nayenshi Singh", emailId: "+917718070884@examin8.com", physics: 2.5, chemistry: 0.0, mathematics: 0.0, total: 2.5 },
];

const LEGACY_RANK_BY_SERIAL: Record<number, number> = {
  1: 68,
  2: 142,
  3: 251,
  4: 289,
  5: 334,
  6: 377,
  7: 421,
  8: 516,
  9: 598,
  10: 673,
  11: 801,
  12: 944,
  13: 1088,
  14: 1327,
  15: 1564,
  16: 1798,
  17: 2066,
  18: 2335,
  19: 2592,
  20: 3011,
  21: 3348,
  22: 3617,
  23: 4022,
  24: 4276,
  25: 4588,
  26: 4761,
  27: 5012,
  28: 5360,
  29: 5428,
  30: 5504,
  31: 5588,
  32: 5711,
  33: 5760,
  34: 5818,
  35: 5876,
  36: 5922,
  37: 5960,
  38: 5988,
  39: 6000,
  40: 820,
  41: 910,
  42: 1840,
  43: 3160,
  44: 3725,
  45: 3880,
  46: 4710,
  47: 5535,
  48: 5920,
};

const ALL_SUBMITTED_RESULTS: SubmittedResult[] = SUBMITTED_RESULTS_RAW.map((item) => ({
  ...item,
  rank: item.rank ?? LEGACY_RANK_BY_SERIAL[item.serialNo] ?? 6000,
  normalizedName: normalizeName(item.fullName),
  normalizedPhone: extractPhoneFromEmailLikeId(item.emailId),
}));

const UNIQUE_SUBMITTED_RESULTS = Array.from(
  ALL_SUBMITTED_RESULTS.reduce((accumulator, item) => {
    const key = getRecordKey(item.fullName, item.emailId);
    const current = accumulator.get(key);

    if (!current || item.total > current.total) {
      accumulator.set(key, item);
    }

    return accumulator;
  }, new Map<string, SubmittedResult>()).values()
).sort((left, right) => right.total - left.total || left.fullName.localeCompare(right.fullName));

const UNIQUE_SUBMITTED_KEYS = new Set(
  UNIQUE_SUBMITTED_RESULTS.map((item) => getRecordKey(item.fullName, item.emailId))
);

const STARTED_NOT_SUBMITTED: StartedNotSubmitted[] = [
  { serialNo: 1, fullName: "Aswini Verma", emailId: "+917004789484@examin8.com" },
  { serialNo: 2, fullName: "Gaurav Sagare", emailId: "+918149203925@examin8.com" },
  { serialNo: 3, fullName: "Srushti Somwanshi", emailId: "+918805734052@examin8.com" },
  { serialNo: 4, fullName: "Adinath Pacharne", emailId: "+919307764027@examin8.com" },
  { serialNo: 5, fullName: "Aswini Verma", emailId: "+917004789484@examin8.com" },
  { serialNo: 6, fullName: "Bhavika Mhaske", emailId: "bhavikamhaske08@gmail.com" },
  { serialNo: 7, fullName: "Janhavi Ingole", emailId: "+919146626693@examin8.com" },
  { serialNo: 8, fullName: "Pratik Bonage", emailId: "+917066773423@examin8.com" },
  { serialNo: 9, fullName: "Rushikesh Pote", emailId: "+918956488650@examin8.com" },
  { serialNo: 10, fullName: "Sonakshi Parshivnikar", emailId: "+919376105201@examin8.com" },
  { serialNo: 11, fullName: "Supriya Darade", emailId: "+917709761448@examin8.com" },
  { serialNo: 12, fullName: "Sushant Zunje", emailId: "+919730158043@examin8.com" },
  { serialNo: 13, fullName: "Tanushri Sarda", emailId: "+919699789200@examin8.com" },
  { serialNo: 14, fullName: "Vikas Chaudhari", emailId: "+918080671935@examin8.com" },
  { serialNo: 15, fullName: "Viraj Lahoti", emailId: "+917666499062@mycbseguide.com" },
];

const UNIQUE_PENDING_RESULTS = Array.from(
  STARTED_NOT_SUBMITTED.reduce((accumulator, item) => {
    const key = getRecordKey(item.fullName, item.emailId);

    if (!UNIQUE_SUBMITTED_KEYS.has(key) && !accumulator.has(key)) {
      accumulator.set(key, {
        ...item,
        normalizedName: normalizeName(item.fullName),
        normalizedPhone: extractPhoneFromEmailLikeId(item.emailId),
      });
    }

    return accumulator;
  }, new Map<string, StartedNotSubmitted & { normalizedName: string; normalizedPhone: string }>()).values()
);

const findBestMatch = <T extends { fullName: string; emailId: string; normalizedName: string; normalizedPhone: string; total?: number }>(
  records: T[],
  query: string
) => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return null;

  const normalizedNameQuery = normalizeName(trimmedQuery);
  const normalizedPhoneQuery = normalizePhoneInput(trimmedQuery);
  const lowerCaseQuery = trimmedQuery.toLowerCase();
  const hasPhoneDigits = /\d/.test(trimmedQuery);

  const matches = records.filter((item) => {
    const exactEmailMatch = item.emailId.toLowerCase() === lowerCaseQuery;
    const emailContainsMatch = lowerCaseQuery.length > 0 && item.emailId.toLowerCase().includes(lowerCaseQuery);
    const exactNameMatch = normalizedNameQuery.length > 0 && item.normalizedName === normalizedNameQuery;
    const partialNameMatch = normalizedNameQuery.length > 0 && item.normalizedName.includes(normalizedNameQuery);
    const phoneMatch = hasPhoneDigits && normalizedPhoneQuery.length >= 10 && item.normalizedPhone === normalizedPhoneQuery;

    return exactEmailMatch || emailContainsMatch || exactNameMatch || partialNameMatch || phoneMatch;
  });

  if (!matches.length) return null;

  matches.sort((left, right) => {
    const leftExactName = left.normalizedName === normalizedNameQuery ? 1 : 0;
    const rightExactName = right.normalizedName === normalizedNameQuery ? 1 : 0;
    const leftPhone = hasPhoneDigits && normalizedPhoneQuery.length >= 10 && left.normalizedPhone === normalizedPhoneQuery ? 1 : 0;
    const rightPhone = hasPhoneDigits && normalizedPhoneQuery.length >= 10 && right.normalizedPhone === normalizedPhoneQuery ? 1 : 0;
    const leftScore = left.total ?? -Infinity;
    const rightScore = right.total ?? -Infinity;

    return rightExactName - leftExactName || rightPhone - leftPhone || rightScore - leftScore || left.fullName.localeCompare(right.fullName);
  });

  return matches[0];
};

function normalizePhoneInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function extractPhoneFromEmailLikeId(value: string) {
  const match = value.match(/\+?\d{10,13}/);
  if (!match) return "";
  return normalizePhoneInput(match[0]);
}

function normalizeName(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function getRecordKey(fullName: string, emailId: string) {
  const normalizedFullName = normalizeName(fullName);
  const phone = extractPhoneFromEmailLikeId(emailId);

  if (phone) return `${normalizedFullName}|${phone}`;
  return `${normalizedFullName}|${emailId.trim().toLowerCase()}`;
}

function formatMarks(value: number) {
  return value.toFixed(2);
}

export default function PCSATResultsPage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");

  const submittedRecord = useMemo(() => findBestMatch(UNIQUE_SUBMITTED_RESULTS, phoneInput), [phoneInput]);

  const pendingRecord = useMemo(() => findBestMatch(UNIQUE_PENDING_RESULTS, phoneInput), [phoneInput]);

  const resultRank = useMemo(() => {
    if (!submittedRecord) return "-";
    return submittedRecord.rank?.toLocaleString() ?? "-";
  }, [submittedRecord]);

  const hasSearched = searchedPhone.length > 0;
  const foundSubmitted = hasSearched && Boolean(submittedRecord);
  const foundPending = hasSearched && !submittedRecord && Boolean(pendingRecord);
  const notFound = hasSearched && !submittedRecord && !pendingRecord;

  const handleSearch = () => {
    setSearchedPhone(phoneInput.trim());
  };

  return (
    <div className="pt-14 md:pt-24 min-h-screen px-3 pb-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-[#E5EAF2] bg-linear-to-br from-[#F7F9FF] via-white to-[#EFF4FF] shadow-sm overflow-hidden">
        <div className="px-4 py-6 md:px-8 md:py-8 border-b border-[#E5EAF2]">
          <p className="inline-flex rounded-full bg-[#EAF0FF] px-3 py-1 text-xs font-semibold tracking-wide text-[#2A4BCF]">
            PCSAT Results 2026
          </p>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-(--text-app-primary)">
            Check Your PCSAT Result
          </h1>
          <p className="mt-2 text-sm md:text-base text-(--text-muted)">
            Enter your phone number, email, or candidate name to view marks and rank.
          </p>

          <div className="mt-6 rounded-2xl border border-[#DCE5FF] bg-white p-3 md:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={phoneInput}
                onChange={(event) => setPhoneInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
                placeholder="Enter mobile number, email, or candidate name"
                className="h-11 flex-1 rounded-lg border border-[#CAD8FF] bg-[#F9FBFF] px-4 text-sm text-(--text-app-primary) outline-none focus:ring-2 focus:ring-[#5A7DFF]"
              />
              <button
                onClick={handleSearch}
                className="h-11 rounded-lg bg-[#2F43F2] px-5 text-sm font-semibold text-white hover:opacity-95 transition-opacity"
              >
                Check Result
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 md:px-8 md:py-8">
          {foundSubmitted && submittedRecord && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#DDE6FF] bg-white p-4 md:p-5">
                <p className="text-xs uppercase tracking-wide text-(--text-muted)">Candidate</p>
                <h2 className="mt-1 text-xl font-semibold text-(--text-app-primary)">{submittedRecord.fullName}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#DCE5FF] bg-white p-4">
                  <p className="text-xs text-(--text-muted)">Physics (50)</p>
                  <p className="text-2xl font-bold text-(--text-app-primary)">{formatMarks(submittedRecord.physics)}</p>
                </div>
                <div className="rounded-xl border border-[#DCE5FF] bg-white p-4">
                  <p className="text-xs text-(--text-muted)">Chemistry (50)</p>
                  <p className="text-2xl font-bold text-(--text-app-primary)">{formatMarks(submittedRecord.chemistry)}</p>
                </div>
                <div className="rounded-xl border border-[#DCE5FF] bg-white p-4">
                  <p className="text-xs text-(--text-muted)">Mathematics (100)</p>
                  <p className="text-2xl font-bold text-(--text-app-primary)">{formatMarks(submittedRecord.mathematics)}</p>
                </div>
                <div className="rounded-xl border border-[#CED9FF] bg-[#EEF2FF] p-4">
                  <p className="text-xs text-[#5063B3]">Total (200)</p>
                  <p className="text-3xl font-extrabold text-[#1F2E67]">{formatMarks(submittedRecord.total)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#CCE3D5] bg-[#F0FAF4] p-4 md:p-5">
                <p className="text-xs uppercase tracking-wide text-[#4B7F63]">Rank</p>
                <p className="mt-2 text-2xl md:text-3xl font-bold text-[#1F5C41]">#{resultRank}</p>
              </div>
            </div>
          )}

          {foundPending && pendingRecord && (
            <div className="rounded-2xl border border-[#FFE0A8] bg-[#FFF9EC] p-5">
              <p className="text-xs uppercase tracking-wide text-[#9E6B00]">Status</p>
              <h2 className="mt-1 text-xl font-semibold text-[#6A4700]">Test Started But Not Submitted</h2>
              <p className="mt-2 text-sm text-[#7A560A]">{pendingRecord.fullName}</p>
            </div>
          )}

          {notFound && (
            <div className="rounded-2xl border border-[#FFD4D4] bg-[#FFF4F4] p-5">
              <p className="text-red-700 font-semibold">No result found for that name or phone number.</p>
              <p className="text-sm text-[#9E5151] mt-1">Try the registered 10-digit phone number, email address, or exact candidate name.</p>
            </div>
          )}

          {!hasSearched && (
            <div className="rounded-2xl border border-[#E5EAF2] bg-white p-5">
              <p className="text-(--text-muted)">Search by phone number, email, or candidate name to see your detailed result.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
