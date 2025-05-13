"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Timer, Play, Square, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  // State for timer
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMinutes, setEditedMinutes] = useState("");
  const [timeWasEdited, setTimeWasEdited] = useState(false);
  
  // State for chore details
  const [choreName, setChoreName] = useState("");
  const [description, setDescription] = useState("");
  
  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start timer
  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsEditing(false); // Exit editing mode if active
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev === 59) {
          setMinutes(m => m + 1);
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
    setEditedMinutes(String(minutes));
    setEditedSeconds(String(seconds));
    setIsEditing(true);
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Handle manual minutes update
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setEditedMinutes(value);
    }
  };
  
  // Handle manual seconds update
  const [editedSeconds, setEditedSeconds] = useState("");
  
  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers 0-59
    if (/^\d*$/.test(value) && (parseInt(value) < 60 || value === "")) {
      setEditedSeconds(value);
    }
  };
  
  const confirmTimeEdit = () => {
    const newMinutes = parseInt(editedMinutes);
    const newSeconds = parseInt(editedSeconds);
    
    if (!isNaN(newMinutes)) {
      setMinutes(newMinutes);
      setTimeWasEdited(true);
    }
    
    if (!isNaN(newSeconds)) {
      setSeconds(newSeconds);
      setTimeWasEdited(true);
    }
    
    setIsEditing(false);
  };
  
  const handleSubmit = () => {
    if (!choreName.trim()) {
      return; // Require a name
    }
    
    onSubmit({
      name: choreName.trim(),
      minutes: minutes,
      description: description.trim() || undefined,
      timeWasEdited: timeWasEdited
    });
    
    // Reset form
    setChoreName("");
    setDescription("");
    setMinutes(0);
    setSeconds(0);
    setIsEditing(false);
    setEditedMinutes("");
    setEditedSeconds("");
    setTimeWasEdited(false);
  };
  
  const canSubmit = choreName.trim() !== "" && (minutes > 0 || (isEditing && editedMinutes.trim() !== ""));
  
  return (
    <div className="border-t-2 border-t-primary bg-background shadow-sm rounded-md">
      <div className="p-2">
        <div className="flex flex-col space-y-1.5">
          {/* Timer Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Timer className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Freeform</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {isEditing ? (
                <div className="flex items-center">
                  <Input
                    value={editedMinutes}
                    onChange={handleMinutesChange}
                    className="w-10 h-6 text-xs px-2"
                    placeholder="Min"
                  />
                  <span className="text-xs mx-0.5">:</span>
                  <Input
                    value={editedSeconds}
                    onChange={handleSecondsChange}
                    className="w-10 h-6 text-xs px-2"
                    placeholder="Sec"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 ml-1" 
                    onClick={confirmTimeEdit}
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  {!isRunning ? (
                    <button 
                      className="text-xs font-mono cursor-pointer hover:text-primary transition-colors"
                      onClick={() => {
                        // Prefill with current timer values
                        setEditedMinutes(String(minutes));
                        setEditedSeconds(String(seconds));
                        setIsEditing(true);
                      }}
                    >
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </button>
                  ) : (
                    <span className="text-xs font-mono">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Name Input */}
          <div className="flex items-center gap-1">
            <Input
              value={choreName}
              onChange={(e) => setChoreName(e.target.value)}
              placeholder="Unnamed Chore"
              className="h-7 text-xs px-2"
            />
          </div>
          
          {/* Description Input */}
          <div className="flex items-center gap-1">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="text-xs px-2 py-1 min-h-[60px] resize-none"
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-end gap-1">
            
            <div className="flex gap-1">
              {isRunning ? (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-7 px-2 py-0 text-xs"
                  onClick={stopTimer}
                >
                  <Square className="h-3 w-3 mr-1" /> Stop
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-7 px-2 py-0 text-xs"
                  onClick={startTimer}
                  disabled={isEditing}
                >
                  <Play className="h-3 w-3 mr-1" /> 
                  {minutes > 0 || seconds > 0 ? "Resume" : "Start"}
                </Button>
              )}
              
              <Button
                variant="secondary"
                size="sm"
                className="h-7 px-2 py-0 text-xs"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
