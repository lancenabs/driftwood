import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from './LANCEGameContext';
import { useLanceTTS } from '../../hooks/useLanceTTS';

// ── Video URLs ─────────────────────────────────────────────────────────────────
const SCENE_1_VIDEO = '/lance-videos/origin_storm.mp4';
const SCENE_2_VIDEO = '/lance-videos/onboard_scene2.mp4';
const SCENE_3_VIDEO = '/lance-videos/onboard_scene3.mp4';

const SCENES = [
  {
    id: 'storm',
    duration: 8500,
    caption: 'Somewhere in the Pacific.\nA storm that had no name.',
    video: SCENE_1_VIDEO,
  },
  {
    id: 'origin',
    duration: 8500,
    caption: "Dr. Malakor spent eleven years building\nsomething the world wasn't ready for.",
    video: SCENE_2_VIDEO,
  },
  {
    id: 'question',
    duration: 99999,
    caption: '',
    video: SCENE_3_VIDEO,
  },
];

const QUESTION = 'Do you want to play a game?';

const NO_RESPONSES = [
  "I'm afraid that's not an option.",
  "That wasn't really a choice.",
  "Your resistance is noted. And irrelevant.",
  "We've established you're stubborn. Shall we proceed?",
];

function useTypewriter(text: string, speed = 38, active = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return { displayed, done };
}

export default function LANCEOriginStory() {
  const { completeOrigin } = useGame();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [questionPhase, setQuestionPhase] = useState<'waiting' | 'typing' | 'choice' | 'refused'>('waiting');
  const [noCount, setNoCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scene = SCENES[sceneIndex];
  const isQuestion = scene.id === 'question';

  // Cast voices: Malakor narrates the two caption scenes (the same voice the
  // player will meet again in the Act 4 journals); LANCE owns the question
  // and every refusal. Clip-or-silence — missing files degrade to text.
  const { speakClipOnly } = useLanceTTS();
  useEffect(() => {
    if (!isQuestion && showCaption) {
      speakClipOnly(`/lance-audio/onboard_narrator_storm_${sceneIndex}.mp3`);
    }
  }, [showCaption, sceneIndex]); // eslint-disable-line
  useEffect(() => {
    if (questionPhase === 'typing') speakClipOnly('/lance-audio/onboard_lance_question.mp3');
    if (questionPhase === 'refused') speakClipOnly(`/lance-audio/onboard_lance_refusal_${Math.min(noCount - 1, NO_RESPONSES.length - 1)}.mp3`);
  }, [questionPhase]); // eslint-disable-line

  const { displayed: captionText } = useTypewriter(scene.caption, 32, showCaption && !isQuestion);
  const { displayed: questionText, done: questionDone } = useTypewriter(QUESTION, 80, questionPhase === 'typing');

  // Scene lifecycle
  useEffect(() => {
    setShowCaption(false);
    setQuestionPhase('waiting');

    const showDelay = setTimeout(() => setShowCaption(true), 700);

    if (!isQuestion) {
      timerRef.current = setTimeout(() => setSceneIndex(i => i + 1), scene.duration);
    }

    return () => {
      clearTimeout(showDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sceneIndex]);

  // Question typing → choice
  useEffect(() => {
    if (questionDone && questionPhase === 'typing') {
      setTimeout(() => setQuestionPhase('choice'), 900);
    }
  }, [questionDone, questionPhase]);

  // Trigger question text at 5s into Scene 3 video
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (isQuestion && e.currentTarget.currentTime >= 5 && questionPhase === 'waiting') {
      setQuestionPhase('typing');
    }
  };

  const handleYes = () => completeOrigin();
  const handleNo = () => {
    setNoCount(c => c + 1);
    setQuestionPhase('refused');
    setTimeout(() => setQuestionPhase('choice'), 2400);
  };

  const nonQuestionScenes = SCENES.filter(s => s.id !== 'question');

  return (
    <div className="fixed inset-0 z-[200]" style={{ background: '#000' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`scene-${sceneIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
        >
          {/* ── Video ── */}
          {scene.video ? (
            <video
              key={scene.video}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'contain', objectPosition: 'center center', background: '#000' }}
              src={scene.video}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: '#000' }} />
          )}

          {/* ── Vignette ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* ── Question overlay (Scene 3) ── */}
          {isQuestion && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-end px-6"
              style={{ paddingBottom: 'max(7rem, calc(env(safe-area-inset-bottom) + 6rem))' }}
            >

              {/* Question text pill */}
              <AnimatePresence>
                {(questionPhase === 'typing' || questionPhase === 'choice' || questionPhase === 'refused') && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{
                      opacity: 1, y: 0, scale: 1,
                      boxShadow: [
                        '0 0 0 1.5px rgba(18,200,220,0.5), 0 0 24px rgba(18,200,220,0.25), 0 8px 32px rgba(0,0,0,0.5)',
                        '0 0 0 1.5px rgba(80,200,64,0.7),  0 0 32px rgba(80,200,64,0.35),  0 8px 32px rgba(0,0,0,0.5)',
                        '0 0 0 1.5px rgba(18,200,220,0.5), 0 0 24px rgba(18,200,220,0.25), 0 8px 32px rgba(0,0,0,0.5)',
                      ],
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      opacity: { duration: 0.45 },
                      scale: { duration: 0.45 },
                      y: { duration: 0.45 },
                      boxShadow: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
                    }}
                    className="w-full max-w-sm mx-auto px-5 py-4 rounded-2xl text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(10,40,38,0.88) 0%, rgba(8,32,22,0.92) 100%)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(80,200,64,0.35)',
                    }}
                  >
                    <p
                      className="text-xl font-black leading-snug"
                      style={{
                        color: '#E8FFF2',
                        fontFamily: 'system-ui',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {/* Word-by-word highlight once typing is done */}
                      {(questionPhase === 'choice' || questionPhase === 'refused')
                        ? QUESTION.split(' ').map((word, i) => (
                          <motion.span
                            key={i}
                            initial={{ color: '#E8FFF2', textShadow: 'none' }}
                            animate={{
                              color: ['#E8FFF2', '#50C840', '#E8FFF2'],
                              textShadow: [
                                'none',
                                '0 0 18px rgba(80,200,64,0.9)',
                                'none',
                              ],
                            }}
                            transition={{ duration: 0.55, delay: i * 0.12 + 0.2, ease: 'easeOut' }}
                          >
                            {word}{i < QUESTION.split(' ').length - 1 ? ' ' : ''}
                          </motion.span>
                        ))
                        : (
                          <>
                            {questionText}
                            {!questionDone && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                style={{ color: '#50C840' }}
                              >|</motion.span>
                            )}
                          </>
                        )
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* No response */}
              <AnimatePresence>
                {questionPhase === 'refused' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 w-full max-w-sm mx-auto px-4 py-2 rounded-xl text-center"
                    style={{
                      background: 'rgba(8,30,20,0.75)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(80,200,64,0.2)',
                    }}
                  >
                    <p className="text-sm italic" style={{ color: '#7FD98C', textShadow: '0 0 10px rgba(80,200,64,0.4)' }}>
                      "{NO_RESPONSES[Math.min(noCount - 1, NO_RESPONSES.length - 1)]}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Yes / No buttons */}
              <AnimatePresence>
                {questionPhase === 'choice' && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex gap-5 mt-5"
                  >
                    <motion.button
                      onClick={handleYes}
                      whileTap={{ scale: 0.93 }}
                      className="px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest"
                      style={{
                        background: 'linear-gradient(135deg, #18C8DC, #50C840)',
                        color: '#03080E',
                        boxShadow: '0 4px 24px rgba(18,200,220,0.4)',
                      }}
                    >
                      Yes.
                    </motion.button>
                    <motion.button
                      onClick={handleNo}
                      whileTap={{ scale: 0.93 }}
                      className="px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border"
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(8px)',
                        borderColor: 'rgba(24,200,220,0.3)',
                        color: 'rgba(200,240,255,0.55)',
                      }}
                    >
                      No.
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Caption overlay (Scenes 1 & 2) ── */}
          {!isQuestion && showCaption && captionText && (
            <div
              className="absolute bottom-0 left-0 right-0 px-7"
              style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="space-y-1.5"
              >
                {captionText.split('\n').map((line, i) => (
                  <p
                    key={i}
                    className={i === 0 ? 'text-lg font-black' : 'text-sm font-medium'}
                    style={{
                      color: i === 0 ? '#E0F8FF' : '#78B8CC',
                      textShadow: '0 2px 20px rgba(0,0,0,0.98)',
                      letterSpacing: i === 0 ? '-0.01em' : '0',
                    }}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            </div>
          )}

          {/* ── Progress dots (Scenes 1 & 2) ── */}
          {!isQuestion && (
            <div
              className="absolute left-0 right-0 flex justify-center gap-2"
              style={{ top: 'max(2.5rem, calc(env(safe-area-inset-top) + 0.75rem))' }}
            >
              {nonQuestionScenes.map((s, i) => (
                <div
                  key={s.id}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === sceneIndex ? 20 : 5,
                    height: 5,
                    background: i === sceneIndex
                      ? 'linear-gradient(90deg, #18C8DC, #50C840)'
                      : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          )}

          {/* ── Skip ── */}
          <button
            onClick={completeOrigin} // Skip means OUT — one press, never a scene-by-scene tour
            className="absolute right-6 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            style={{
              bottom: 'max(1.75rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Skip
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
