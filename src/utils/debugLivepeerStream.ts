/**
 * Debug utility to check Livepeer stream configuration
 * Use this to verify if multistream targets are properly set up
 */

export async function debugLivepeerStream(streamId: string, livepeerApiKey: string) {
  try {
    const response = await fetch(`https://livepeer.studio/api/stream/${streamId}`, {
      headers: {
        'Authorization': `Bearer ${livepeerApiKey}`
      }
    });

    const data = await response.json();
    
    console.log('=== LIVEPEER STREAM DEBUG ===');
    console.log('Stream ID:', data.id);
    console.log('Stream Key:', data.streamKey);
    console.log('Playback ID:', data.playbackId);
    console.log('Multistream Targets:', data.multistream?.targets);
    console.log('Is Active:', data.isActive);
    
    if (!data.multistream?.targets || data.multistream.targets.length === 0) {
      console.error('❌ NO MULTISTREAM TARGETS CONFIGURED!');
      console.error('This is why YouTube is not receiving the stream.');
      console.error('Backend needs to add YouTube as a multistream target.');
    } else {
      console.log('✅ Multistream targets found:', data.multistream.targets.length);
      data.multistream.targets.forEach((target: any, index: number) => {
        console.log(`Target ${index + 1}:`, target);
      });
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch stream info:', error);
    return null;
  }
}

/**
 * Instructions for backend team to fix YouTube multistream:
 * 
 * 1. When creating a Livepeer stream, also create a multistream target:
 * 
 * POST https://livepeer.studio/api/multistream/target
 * {
 *   "name": "YouTube",
 *   "url": "rtmp://a.rtmp.youtube.com/live2/{YOUTUBE_STREAM_KEY}"
 * }
 * 
 * 2. Then add that target to the stream:
 * 
 * PATCH https://livepeer.studio/api/stream/{streamId}
 * {
 *   "multistream": {
 *     "targets": [
 *       {
 *         "profile": "720p0",
 *         "videoOnly": false,
 *         "id": "{multistream_target_id}"
 *       }
 *     ]
 *   }
 * }
 * 
 * This must be done BEFORE the user starts streaming from the browser.
 */
