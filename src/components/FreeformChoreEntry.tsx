"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Timer, Play, Square, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const freeformChoreSchema = z.object({
  choreName: z.string().min(1, "Chore name is required"),
  description: z.string().optional(),
});

type FreeformChoreFormValues = z.infer<typeof freeformChoreSchema>;

type FreeformChoreEntryProps = {
  groupId: string;
  onSubmit: (data: { 
    name: string; 
    minutes: number; 
    description?: string; 
    timeWasEdited: boolean 
  }) => void;
};

export default function FreeformChoreEntry({ groupId, onSubmit }: FreeformChoreEntryProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<FreeformChoreFormValues>({
    resolver: zodResolver(freeformChoreSchema),
    mode: "onChange",
    defaultValues: {
      choreName: "",
      description: "",
    },
  });

  // State for timer
  const [isRunning, setIsRunning] = useState(false);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [displayMinutes, setDisplayMinutes] = useState(0);
  const [editingTime, setEditingTime] = useState<{ minutes: string; seconds: string } | null>(null);
  const [timeWasEdited, setTimeWasEdited] = useState(false);
  
  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start timer
  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setEditingTime(null); // Exit editing mode if active
    timerRef.current = setInterval(() => {
      setDisplaySeconds(prev => {
        if (prev === 59) {
          setDisplayMinutes(m => m + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };
  
  // Stop timer
  const stopTimer = () => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Populate the edit form with current timer values
    setEditingTime({
      minutes: String(displayMinutes),
      seconds: String(displaySeconds)
    });
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Handle time value changes (minutes or seconds)
  const handleTimeValueChange = (field: 'minutes' | 'seconds', value: string) => {
    setEditingTime(prev => {
      if (!prev) return null;
      
      // Validate input
      if (field === 'minutes' && !/^\d*$/.test(value)) {
        return prev;
      }
      
      if (field === 'seconds' && (!/^\d*$/.test(value) || (value !== "" && parseInt(value) >= 60))) {
        return prev;
      }
      
      return { ...prev, [field]: value };
    });
  };
  
  const confirmTimeEdit = () => {
    if (!editingTime) return;
    
    const newMinutes = parseInt(editingTime.minutes);
    const newSeconds = parseInt(editingTime.seconds);
    
    if (!isNaN(newMinutes)) {
      setDisplayMinutes(newMinutes);
      setTimeWasEdited(true);
    }
    
    if (!isNaN(newSeconds)) {
      setDisplaySeconds(newSeconds);
      setTimeWasEdited(true);
    }
    
    setEditingTime(null);
  };
  
  const onFormSubmit = (data: FreeformChoreFormValues) => {
    onSubmit({
      name: data.choreName.trim(),
      minutes: displayMinutes,
      description: data.description?.trim() || undefined,
      timeWasEdited: timeWasEdited
    });
    
    // Reset form
    resetForm();
    setDisplayMinutes(0);
    setDisplaySeconds(0);
    setEditingTime(null);
    setTimeWasEdited(false);
    
    // Make sure timer is stopped
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };
  
  const canSubmit = isValid && (displayMinutes > 0 || displaySeconds > 0 || 
    (editingTime && (editingTime.minutes.trim() !== "" || editingTime.seconds.trim() !== "")));
  
  return (
    <form 
      onSubmit={handleSubmit(onFormSubmit)} 
      className="border-t-2 border-t-primary bg-background shadow-sm rounded-md pb-safe"
    >
      {/* Add meta tag to prevent zooming on input focus */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      
      <div className="p-3 sm:p-2">
        <div className="flex flex-col space-y-3 sm:space-y-1.5">
          {/* Timer Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Timer className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Freeform</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {editingTime ? (
                <div className="flex items-center">
                  <Input
                    value={editingTime.minutes}
                    onChange={(e) => handleTimeValueChange('minutes', e.target.value)}
                    className="w-14 sm:w-10 h-9 sm:h-6 text-base sm:text-xs px-2"
                    placeholder="Min"
                    aria-label="Edit minutes"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <span className="text-base sm:text-xs mx-1 sm:mx-0.5">:</span>
                  <Input
                    value={editingTime.seconds}
                    onChange={(e) => handleTimeValueChange('seconds', e.target.value)}
                    className="w-14 sm:w-10 h-9 sm:h-6 text-base sm:text-xs px-2"
                    placeholder="Sec"
                    aria-label="Edit seconds"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 sm:h-6 sm:w-6 p-0 ml-1" 
                    onClick={confirmTimeEdit}
                    type="button"
                  >
                    <Check className="h-4 w-4 sm:h-3 sm:w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  {!isRunning ? (
                    <button 
                      type="button"
                      className="text-base sm:text-xs font-mono cursor-pointer hover:text-primary transition-colors p-2 sm:p-0"
                      onClick={() => {
                        // Prefill with current timer values
                        setEditingTime({
                          minutes: String(displayMinutes),
                          seconds: String(displaySeconds)
                        });
                      }}
                    >
                      {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                    </button>
                  ) : (
                    <span className="text-base sm:text-xs font-mono p-2 sm:p-0">
                      {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Name Input */}
          <div className="flex items-center gap-1">
            <Input
              {...register("choreName")}
              placeholder="Chore Name"
              className={cn("h-9 sm:h-7 text-base sm:text-xs px-3 sm:px-2", errors.choreName && "border-destructive")}
              aria-label="Chore name"
              autoComplete="off"
              inputMode="text"
            />
          </div>
          {errors.choreName && (
            <p className="text-xs text-destructive -mt-1">{errors.choreName.message}</p>
          )}
          
          {/* Description Input */}
          <div className="flex items-center gap-1">
            <Textarea
              {...register("description")}
              placeholder="Description (optional)"
              className="text-base sm:text-xs px-3 sm:px-2 py-2 sm:py-1 min-h-[80px] sm:min-h-[60px] resize-none"
              autoComplete="off"
              rows={3}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-end gap-2 sm:gap-1 mt-2 sm:mt-0">
            
            <div className="flex gap-2 sm:gap-1 w-full sm:w-auto">
              {isRunning ? (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-10 sm:h-7 px-4 sm:px-2 py-0 text-sm sm:text-xs flex-1 sm:flex-initial"
                  onClick={stopTimer}
                  type="button"
                >
                  <Square className="h-4 w-4 sm:h-3 sm:w-3 mr-1" /> Stop
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-10 sm:h-7 px-4 sm:px-2 py-0 text-sm sm:text-xs flex-1 sm:flex-initial"
                  onClick={startTimer}
                  disabled={!!editingTime}
                  type="button"
                >
                  <Play className="h-4 w-4 sm:h-3 sm:w-3 mr-1" /> 
                  {displayMinutes > 0 || displaySeconds > 0 ? "Resume" : "Start"}
                </Button>
              )}
              
              <Button
                variant="secondary"
                size="sm"
                className="h-10 sm:h-7 px-4 sm:px-2 py-0 text-sm sm:text-xs flex-1 sm:flex-initial"
                disabled={!canSubmit}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
