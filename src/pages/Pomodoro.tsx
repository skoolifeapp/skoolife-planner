import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import SupportButton from '@/components/SupportButton';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

type SessionType = 'work' | 'shortBreak' | 'longBreak';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const getSessionTime = useCallback((type: SessionType) => {
    switch (type) {
      case 'work': return WORK_TIME;
      case 'shortBreak': return SHORT_BREAK;
      case 'longBreak': return LONG_BREAK;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      if (sessionType === 'work') {
        setCompletedPomodoros((prev) => prev + 1);
        // After 4 pomodoros, take a long break
        if ((completedPomodoros + 1) % 4 === 0) {
          setSessionType('longBreak');
          setTimeLeft(LONG_BREAK);
        } else {
          setSessionType('shortBreak');
          setTimeLeft(SHORT_BREAK);
        }
      } else {
        setSessionType('work');
        setTimeLeft(WORK_TIME);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, sessionType, completedPomodoros]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getSessionTime(sessionType));
  };

  const switchSession = (type: SessionType) => {
    setSessionType(type);
    setTimeLeft(getSessionTime(type));
    setIsRunning(false);
  };

  const progress = ((getSessionTime(sessionType) - timeLeft) / getSessionTime(sessionType)) * 100;

  const getSessionLabel = () => {
    switch (sessionType) {
      case 'work': return 'Focus';
      case 'shortBreak': return 'Pause courte';
      case 'longBreak': return 'Pause longue';
    }
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work': return 'text-primary';
      case 'shortBreak': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Timer className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Pomodoro</h1>
      </div>

      {/* Main Timer Card */}
      <div className="max-w-md mx-auto space-y-6">
        {/* Session Type Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={sessionType === 'work' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchSession('work')}
            className="gap-2"
          >
            <Brain className="w-4 h-4" />
            Focus
          </Button>
          <Button
            variant={sessionType === 'shortBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchSession('shortBreak')}
            className="gap-2"
          >
            <Coffee className="w-4 h-4" />
            Pause courte
          </Button>
          <Button
            variant={sessionType === 'longBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchSession('longBreak')}
            className="gap-2"
          >
            <Coffee className="w-4 h-4" />
            Pause longue
          </Button>
        </div>

        {/* Timer Display */}
        <Card className="border shadow-sm">
          <CardContent className="p-8 flex flex-col items-center">
            {/* Progress Ring */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className={cn("transition-all duration-1000", getSessionColor())}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
                <span className={cn("text-sm font-medium mt-1", getSessionColor())}>{getSessionLabel()}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="w-12 h-12 rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full"
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="border shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pomodoros complétés</p>
              <p className="text-2xl font-bold">{completedPomodoros}</p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>🍅 25 min de focus → 5 min de pause</p>
          <p>Après 4 pomodoros → 15 min de pause longue</p>
        </div>
      </div>

      <SupportButton />
    </div>
  );
};

export default Pomodoro;
