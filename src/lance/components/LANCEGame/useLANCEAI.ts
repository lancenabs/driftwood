import { useState, useCallback } from 'react';
import { useGame } from './LANCEGameContext';

export type LANCETrigger = 'home' | 'tool_complete' | 'challenge_complete' | 'checkin_complete';

export interface AIRequestContext {
  trigger: LANCETrigger;
  toolJustUsed?: string;
  userContent?: string;
}

export function useLANCEAI() {
  const { userName, moodLogs, completedChallenges, intern } = useGame();

  const [lanceResponse, setLanceResponse] = useState<string | null>(null);
  const [internResponse, setInternResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);

  const fetchResponses = useCallback(async (ctx: AIRequestContext) => {
    if (!available) return;
    setLoading(true);
    setLanceResponse(null);
    setInternResponse(null);

    const sharedBody = {
      userName,
      context: {
        ...ctx,
        recentMoods: moodLogs.slice(0, 7),
        completedChallenges,
      },
    };

    try {
      const [lanceResult, internResult] = await Promise.all([
        fetch('/api/lance/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sharedBody),
        }).then(r => r.json()),
        fetch('/api/intern/respond', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...sharedBody,
            internName: intern.name,
            personalityStyle: intern.personalityId,
          }),
        }).then(r => r.json()),
      ]);

      if (lanceResult.success) {
        setLanceResponse(lanceResult.response);
      } else if (lanceResult.error === 'no_api_key') {
        setAvailable(false);
      }

      if (internResult.success) {
        setInternResponse(internResult.response);
      }
    } catch {
      // Network error — silently fall through to static content
    } finally {
      setLoading(false);
    }
  }, [userName, moodLogs, completedChallenges, intern, available]);

  return { lanceResponse, internResponse, loading, available, fetchResponses };
}
