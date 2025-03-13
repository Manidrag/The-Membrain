"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Save, Loader2 } from "lucide-react"

const Recorder = ({ onTranscriptionComplete, isAIEnabled = false }) => {
  const [transcription, setTranscription] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const audioContextRef = useRef(null)
  const processorRef = useRef(null)
  const wsRef = useRef(null)
  const gainNodeRef = useRef(null)
  const timerRef = useRef(null)
  const token = localStorage.getItem("token")
  const LINK=import.meta.env.VITE_API_URL;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      setIsProcessing(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext({ sampleRate: 16000 })
      const source = audioContextRef.current.createMediaStreamSource(stream)
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.gain.value = 1.5
      processorRef.current = audioContextRef.current.createScriptProcessor(16384, 1, 1)

      wsRef.current = new WebSocket("ws://localhost:3000")
      wsRef.current.onopen = () => {
        setIsRecording(true)
        setIsProcessing(false)
        setRecordingTime(0)

        // Start timer
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)

        if (!transcription) {
          setTranscription("Listening...")
        }
      }

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.text) {
          setTranscription((prev) => (prev === "Listening..." ? data.text : prev + " " + data.text))
        }
      }

      wsRef.current.onerror = (error) => console.error("WebSocket error:", error)
      wsRef.current.onclose = () => console.log("WebSocket closed")

      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        const pcmData = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          const sample = inputData[i] * gainNodeRef.current.gain.value
          pcmData[i] = Math.min(1, Math.max(-1, sample)) * 32767
        }
        const buffer = new Uint8Array(pcmData.buffer)
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(buffer)
        }
      }

      source.connect(gainNodeRef.current)
      gainNodeRef.current.connect(processorRef.current)
      processorRef.current.connect(audioContextRef.current.destination)
    } catch (error) {
      console.error("Start recording error:", error)
      setTranscription("Mic trouble—check permissions!")
      setIsProcessing(false)
    }
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      setIsRecording(false)
      if (wsRef.current) wsRef.current.close()

      // If AI transcription is enabled, simulate processing
      if (isAIEnabled && transcription && transcription !== "Listening...") {
        setIsProcessing(true)
        setTimeout(() => {
          // Simulate AI enhancement
          const enhancedTranscription = `${transcription} [AI Enhanced]`
          setTranscription(enhancedTranscription)
          setIsProcessing(false)
        }, 1500)
      }
    }
  }

  const saveTranscription = async () => {
    if (!transcription || transcription === "Listening...") return

    if (onTranscriptionComplete) {
      onTranscriptionComplete(transcription)
      setTranscription("")
      return
    }

    try {
      setIsProcessing(true)
      const response = await fetch(LINK +"/notes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcription }),
      })
      if (!response.ok) throw new Error("Failed to save")
      setTranscription("")
      setIsProcessing(false)
    } catch (error) {
      console.error("Save transcription error:", error)
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (audioContextRef.current) audioContextRef.current.close()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5">
      {/* Recording visualization */}
      <div className="h-16 bg-gray-800 relative overflow-hidden">
        {isRecording ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center gap-1 h-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${Math.random() * 0.8 + 0.5}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-0.5 w-4/5 bg-gray-700 rounded-full">
              <div className="h-full w-0 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-2 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            REC {formatTime(recordingTime)}
          </div>
        )}

        {isAIEnabled && (
          <div className="absolute top-2 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">AI</div>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={startRecording}
            disabled={isRecording || isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="h-4 w-4" />
            Start
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording || isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="h-4 w-4" />
            Stop
          </button>

          {!isRecording && transcription && transcription !== "Listening..." && (
            <button
              onClick={saveTranscription}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {onTranscriptionComplete ? "Add to Note" : "Save"}
                </>
              )}
            </button>
          )}
        </div>

        <div className="relative min-h-[80px] p-3 bg-gray-800 rounded-lg border border-gray-600">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-cyan-500 animate-spin" />
                <span className="text-gray-400">Processing transcription...</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 whitespace-pre-wrap">
              {transcription || "Your transcription will appear here..."}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recorder

