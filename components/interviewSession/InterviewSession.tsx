"use client";
import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  ISpeechRecognition,
  ISpeechRecognitionEvent,
  ISpeechRecognitionErrorEvent,
  InterviewSessionProps,
} from "./SessionTypes";
import PrevNextBtn from "./PrevNextBtn";
import RecordingBtn from "./RecordingBtn";
import { Mic, Sparkles, Lightbulb, Zap, CheckCircle2 } from "lucide-react";

export default function InterviewSession({
  interview,
  onInterviewUpdate,
}: InterviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);

  const webcamRef = useRef<Webcam>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  // initialize the interview session based on interview data, interview -> data.interview
  useEffect(() => {
    if (
      interview &&
      interview.questions &&
      Array.isArray(interview.questions)
    ) {
      try {
        // find the first unanswered questions
        const firstUnansweredIndex = interview.questions.findIndex(
          (q) => !q.answer || q.answer.trim() === ""
        );

        // if all questions are unanswered, set to the last question
        const newIndex =
          firstUnansweredIndex === -1
            ? interview.questions.length - 1
            : firstUnansweredIndex;
        setCurrentIndex(newIndex);

        // if the current question has the answer, load it
        const currentQuestion = interview.questions[newIndex];
        if (currentQuestion && currentQuestion.answer) {
          setUserAnswer(currentQuestion.answer);
        } else {
          setUserAnswer("");
        }
      } catch (err) {
        setError("Error initializing interview. Please refresh the page");
      }
    }
  }, [interview]);

  // update progress when current index changes
  useEffect(() => {
    try {
      // calculate progress percentage
      if (
        interview &&
        interview.questions &&
        Array.isArray(interview.questions) &&
        interview.questions.length > 0
      ) {
        setProgress(
          Math.round((currentIndex / interview.questions.length) * 100)
        );
      }
    } catch (err) {
      console.log("Error calculating progress: ", err);
    }
  }, [currentIndex, interview]);

  // clean up speech recoginiton on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, []);

  // handle speech to text
  const handleSpeechToText = () => {
    if (isRecording) {
      // stop recording
      stopRecording();
      return;
    }

    // start recording
    startRecording();
  };

  const startRecording = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError(
          "Speech Recognition is not supported in your browser. Try using chrom or edge"
        );
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      // clear previous transcripts
      setTranscript("");

      // start timer
      setRecordingTime(0);
      timeRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsRecording(true);
      };

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimResults = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";

            // add final transcript to answer
            setUserAnswer((prev) => {
              const trimmedPrev = prev.trim();
              return trimmedPrev ? trimmedPrev + " " + transcript : transcript;
            });
          } else {
            interimResults += transcript;
          }
        }

        // update the interim transcript
        setTranscript(interimResults);
      };

      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        stopRecording();
      };

      recognition.onend = () => {
        console.log("speech recognition ended");
        stopRecording();
      };

      recognition.start();
    } catch (error: unknown) {
      console.log("Error starting speech recognition:", error);
      setError("Failed to start speech recognition. Please try again");
      stopRecording();
    }
  };

  // stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (timeRef.current) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }

    setIsRecording(false);
    setTranscript("");
  };

  // formate recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // handle navigation between questions
  const handleNextQuestion = () => {
    if (currentIndex < interview.questions.length - 1) {
      // Stop recording if active
      if (isRecording) {
        stopRecording();
      }

      // Save the current answer before moving to the next question
      saveCurrentAnswer()
        .then(() => {
          setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex + 1; // Corrected the increment

            // Load the next question's answer if it exists
            const nextQuestion = interview.questions[newIndex];
            setUserAnswer(nextQuestion?.answer || "");
            setTranscript("");

            return newIndex; // Return the updated index
          });
        })
        .catch((error) => {
          console.error("Error saving answer before navigation:", error);
          setError("Failed to save your answer. Please try again.");
        });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      // stop recording if active
      if (isRecording) {
        stopRecording();
      }

      // save the current answer before moving to the previous question
      saveCurrentAnswer()
        .then(() => {
          setCurrentIndex(currentIndex - 1);

          // load prevoius question's answer if exists
          const prevQuestion = interview.questions[currentIndex - 1];
          setUserAnswer(
            prevQuestion && prevQuestion.answer ? prevQuestion.answer : ""
          );
          setTranscript("");
        })
        .catch((error) => {
          console.error("Error saving answer before navigation: ", error);
          setError("Failed to save your answer. Please try again");
        });
    }
  };

  // function to save the current answer without navigation
  const saveCurrentAnswer = async () => {
    // dont save if answer is empty or unchanged
    const trimmedAnswer = userAnswer.trim();
    const currentQuestion = interview.questions[currentIndex];

    if (!trimmedAnswer || currentQuestion.answer === trimmedAnswer) {
      return Promise.resolve(); // nothing to save
    }

    try {
      setIsSubmitting(true);

      // get token from localstorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // update the interview session in database
      const response = await fetch(`/api/interview/${interview._id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionIndex: currentIndex,
          answer: trimmedAnswer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save answer");
      }

      // get the updated interview data
      const data = await response.json();
      console.log(`Answer saved for question: ${currentIndex}`);

      // update the parent component with the updated interview data
      if (onInterviewUpdate && data.interview) {
        onInterviewUpdate(data.interview);
      }

      return Promise.resolve();
    } catch (error: any) {
      console.log("Error saving answer: ", error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // modify the handlesubmitanswer function to use the savecurrentanswer function
  const handleSubmitAnswer = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      // validate interview data
      if (!interview || !interview._id) {
        throw new Error("Invalid interview data");
      }

      // get token from localstorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const trimmedAnswer = userAnswer.trim();
      if (!trimmedAnswer) {
        throw new Error("Please provide an answer before submitting");
      }

      // update the interview session in the database
      const response = await fetch(`/api/interview/${interview._id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionIndex: currentIndex,
          answer: trimmedAnswer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit answer");
      }

      // get the updated interview data
      const data = await response.json();
      console.log(
        `Answer submitting for question ${currentIndex} with score: ${data.analysis?.score}`
      );

      // update the present component with the updated interview data
      if (onInterviewUpdate && data.interview) {
        onInterviewUpdate(data.interview);
      }

      // move to the next question
      if (
        interview.questions &&
        Array.isArray(interview.questions) &&
        currentIndex < interview.questions.length - 1
      ) {
        setCurrentIndex(currentIndex + 1);

        // check if the next question already has the answer
        const nextQuestion = interview.questions[currentIndex + 1];
        setUserAnswer(
          nextQuestion && nextQuestion.answer ? nextQuestion.answer : ""
        );
        setTranscript("");
      } else {
        // all questions answered complete the interview
        try {
          console.log("completing interview directly...");

          // first, ensure the current answer is saved
          await saveCurrentAnswer();

          // complete the interview
          const completeResponse = await fetch(
            `/api/interview/${interview._id}/complete`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!completeResponse.ok) {
            const errorData = await completeResponse.json();
            console.error("Error response from complete endpoint: ", errorData);

            // if there are unanswered question show specific error
            if (errorData.unansweredCount) {
              throw new Error(
                `Please answer all questions before completing the interview. ${errorData.unansweredCount} questions remain unanswered`
              );
            }

            throw new Error(
              errorData.message || "Failed to complete interview"
            );
          }

          const completionData = await completeResponse.json();
          console.log(
            "Interview completed successfully, redirecting to result page",
            completionData
          );

          // redirect directly to result page without waiting
          window.location.href = `/interview/${interview._id}/results`;
        } catch (completeError: any) {
          console.log("Error completing interview: ", completeError);
          setError(
            completeError.message ||
              "Error completing interview. Please try again later"
          );
        }
      }
    } catch (error: any) {
      console.error("Error submitting answer: ", error);
      setError(error.message || "Error submitting answer. Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 text-white bg-[var(--input-bg)]/30 rounded-lg shadow-sm">
      {/*previous, next btn question length  */}

      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-400">
          <div className="flex items-center gap-2">
            Question
            <span className="bg-gradient-to-br from-[#b87a9c] to-[#d8a1bc] text-white font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-lg shadow-[#b87a9c]/20">
              {currentIndex + 1}
            </span>{" "}
            <span> of {interview.questions.length}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <PrevNextBtn
            onClick={handlePreviousQuestion}
            disabled={currentIndex === 0 || isSubmitting}
            classes={currentIndex === 0 || isSubmitting}
            label="Previous"
          />
          <PrevNextBtn
            onClick={handleNextQuestion}
            disabled={
              currentIndex === interview.questions.length - 1 || isSubmitting
            }
            classes={
              currentIndex === interview.questions.length - 1 || isSubmitting
            }
            label="Next"
          />
        </div>
      </div>

      {/* progress bar */}
      <div className="w-full rounded-full h-2.5 bg-slate-800">
        <div
          className="bg-gradient-to-r from-[#b87a9c] to-[#d8a1bc] h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* web cam section */}
        <div className="lg:w-1/3 bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#b87a9c]/20 to-transparent p-6">
            <h1 className="flex items-center gap-2 text-xl font-semibold text-white">
              <span className="h-5 w-1 bg-[#b87a9c] rounded-full"></span>
              Voice Response
            </h1>
          </div>

          <div className="w-full p-6">
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                className="rounded-lg w-full h-[200px] shadow-md bg-zinc-900"
                videoConstraints={{
                  width: 560,
                  height: 300,
                  facingMode: "user",
                }}
              />
              {isRecording && (
                <div className="absolute flex items-center px-2 py-1 text-xs text-white bg-red-500 rounded-full top-3 right-3">
                  <span className="inline-block w-2 h-2 mr-1 bg-white rounded-full animate-pulse"></span>
                  REC {formatTime(recordingTime)}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Mic className="w-5 text-[#b87a9c]" />
              <span>Audio Input</span>
            </div>

            <RecordingBtn
              Icon={Mic}
              style="bg-gradient-to-r from-[#b87a9c] to-[#d8a1bc] hover:from-[#a06a8c] hover:to-[#c890ab] shadow-[#b87a9c]/20"
              trueText="Stop Recording"
              falseText="Start Voice Recording"
              color="bg-red-500 hover:bg-red-600"
              onClick={handleSpeechToText}
              isRecording={isRecording}
              disabled={isSubmitting}
            />
            <div className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
              {isRecording
                ? "Speak clearly into your microphone. Your speech will be transcribed automatically."
                : "Click the button above to start recording your answer."}
            </div>

            <div className="border-t mt-6 border-[#b87a9c]/30">
              <h2 className="flex items-center gap-2 mt-7">
                <Lightbulb className="w-4 text-[#b87a9c]" />
                Interview Tips:
              </h2>

              <ul className="mt-4 space-y-3 text-xs text-slate-400">
                <li className="flex items-center gap-2 bg-[#b87a9c]/10 p-2 rounded-md border border-[#b8a1bc]/30 hover:border-[#b87a9c]/30 transition-all">
                  <span className="bg-[#b87a9c]/20 text-[#d8a1bc] rounded-full p-1 mt-0.5">
                    <Zap className="w-3 h-3" />
                  </span>
                  <span>
                    Speak clearly and at a moderate pace for better voice
                    recognition
                  </span>
                </li>
                <li className="flex items-center gap-2 bg-[#b87a9c]/10 p-2 rounded-md border border-[#b8a1bc]/30 hover:border-[#b87a9c]/30 transition-all">
                  <span className="bg-[#b87a9c]/20 text-[#d8a1bc] rounded-full p-1 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </span>
                  <span>
                    Structure your answer with an introduction, main points, and
                    conclusion
                  </span>
                </li>
                <li className="flex items-center gap-2 bg-[#b87a9c]/10 p-2 rounded-md border border-[#b8a1bc]/30 hover:border-[#b87a9c]/30 transition-all">
                  <span className="bg-[#b87a9c]/20 text-[#d8a1bc] rounded-full p-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <span>
                    Use specific examples from your experience to demonstrate
                    your knowledge
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* interview section */}
        <div className="space-y-6 lg:w-2/3">
          {/* questioin appear */}
          <div className="bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden">
            <div className="bg-[#b87a9c]/10 px-1 py-3">
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-[#d8a1bc]"></div>
                <div className="h-2 w-2 rounded-full bg-[#b87a9c]"></div>
                <div className="h-2 w-2 rounded-full bg-[#a06a8c]"></div>
                <div className="flex-1"></div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <span className="h-5 w-1 bg-[#b87a9c] rounded-full"></span>
                Current Question
              </h2>
              <p className="text-lg max-sm:text-sm">
                {interview.questions[currentIndex].text}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden">
            <div className="bg-[#b87a9c]/10 p-1 text-sm">
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="flex-1"></div>
                <div className="bg-[#b87a9c]/20 text-[#d8a1bc] hover:bg-[#b87a9c]/30 px-3 py-1 rounded-full border-[#b87a9c]/30 font-semibold">
                  Your Response
                </div>
              </div>
            </div>
            <div className="p-6">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <span className="h-5 w-1 bg-[#b87a9c] rounded-full"></span>
                Your Answer
              </h2>
              <textarea
                className="min-h-[180px] w-full rounded-xl p-4 border border-[#b8a1bc]/30 bg-[var(--input-bg)]/80 text-slate-200 placeholder:text-slate-500 resize-none focus:border-[#b87a9c] focus:ring-[#b87a9c]/20 shadow-inner"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer will appear here as you speak. You can also type or edit your answer."
                disabled={isSubmitting}
              />

              {isRecording && transcript && (
                <div className="p-2 mt-2 text-sm text-gray-300 bg-gray-700 rounded">
                  <span className="font-medium">Currently transcribing:</span>{" "}
                  {transcript}
                </div>
              )}

              {error && (
                <div className="p-2 mt-2 text-sm text-red-500 rounded bg-red-900/20">
                  {error}
                </div>
              )}

              {/* submit answer */}

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-medium text-zinc-300">
                  {interview.questions[currentIndex].answer
                    ? "This question has been asnwered. You can edit your answer."
                    : ""}
                </div>

                {/* submit answer btn */}

                <div>
                  <RecordingBtn
                    Icon={Sparkles}
                    color="bg-[#c890ab] cursor-not-allowed"
                    style="bg-gradient-to-r from-[#b87a9c] to-[#d8a1bc] hover:from-[#a06a8c] hover:to-[#c890ab] text-white rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-[#b87a9c]/30 border border-[#d8a1bc]/20"
                    trueText="Submitting..."
                    falseText="Submit Answer"
                    isRecording={isSubmitting}
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !userAnswer.trim()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
