// this hook will handle the audio recording functionality
import { useState, useRef } from 'react';

export function useAudioRecorder() {

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);


    // this function starts the audio recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder  = new MediaRecorder(stream);
            const audioChunks: Blob[] = [];

            mediaRecorderRef.current = recorder;
            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
                // clear the timer when recording stops
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                }
            };

            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start the timer to update recording time every second
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };


    // this function stops the audio recording
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };


    // this function resets the recording state
    const resetRecording = () => {
        setAudioBlob(null);
        setRecordingTime(0);
        setIsRecording(false);
        mediaRecorderRef.current = null;
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    return { isRecording, recordingTime, audioBlob, startRecording, stopRecording, resetRecording };
}