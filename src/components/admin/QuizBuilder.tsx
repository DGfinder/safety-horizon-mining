'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Plus,
  Save,
  Eye,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

interface Module {
  id: string
  title: string
  kind: string
  quizData: any
  passingScore: number
}

interface QuizBuilderProps {
  module: Module
}

interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'multi-select'
  question: string
  explanation?: string
  options: QuizOption[]
  correctAnswers: string[] // IDs of correct options
  points: number
}

interface QuizOption {
  id: string
  text: string
}

export default function QuizBuilder({ module }: QuizBuilderProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    module.quizData?.questions || []
  )
  const [passingScore, setPassingScore] = useState(module.passingScore || 70)
  const [saving, setSaving] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0)

  const addQuestion = (type: 'multiple-choice' | 'true-false' | 'multi-select') => {
    let defaultOptions: QuizOption[] = []

    if (type === 'true-false') {
      defaultOptions = [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' },
      ]
    } else {
      defaultOptions = [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
        { id: 'd', text: 'Option D' },
      ]
    }

    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      type,
      question: 'Enter your question here...',
      explanation: '',
      options: defaultOptions,
      correctAnswers: [],
      points: 1,
    }

    setQuestions([...questions, newQuestion])
    setExpandedQuestion(questions.length)
  }

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], ...updates }
    setQuestions(updated)
  }

  const deleteQuestion = (index: number) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const moveQuestionUp = (index: number) => {
    if (index === 0) return
    const updated = [...questions]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setQuestions(updated)
  }

  const moveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return
    const updated = [...questions]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setQuestions(updated)
  }

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex]
    const newOptionId = String.fromCharCode(97 + question.options.length)
    const newOption: QuizOption = {
      id: newOptionId,
      text: `Option ${newOptionId.toUpperCase()}`,
    }
    updateQuestion(questionIndex, {
      options: [...question.options, newOption],
    })
  }

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const question = questions[questionIndex]
    const options = [...question.options]
    options[optionIndex] = { ...options[optionIndex], text }
    updateQuestion(questionIndex, { options })
  }

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex]
    const optionId = question.options[optionIndex].id
    updateQuestion(questionIndex, {
      options: question.options.filter((_, i) => i !== optionIndex),
      correctAnswers: question.correctAnswers.filter((id) => id !== optionId),
    })
  }

  const toggleCorrectAnswer = (questionIndex: number, optionId: string) => {
    const question = questions[questionIndex]
    let correctAnswers = [...question.correctAnswers]

    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      // Only one correct answer
      correctAnswers = [optionId]
    } else {
      // Multi-select: toggle
      if (correctAnswers.includes(optionId)) {
        correctAnswers = correctAnswers.filter((id) => id !== optionId)
      } else {
        correctAnswers.push(optionId)
      }
    }

    updateQuestion(questionIndex, { correctAnswers })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/modules/${module.id}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          passingScore,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      alert('Quiz saved successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error saving quiz:', error)
      alert('Failed to save quiz. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => addQuestion('multiple-choice')}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Multiple Choice
              </button>
              <button
                onClick={() => addQuestion('multi-select')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Multi-Select
              </button>
              <button
                onClick={() => addQuestion('true-false')}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                True/False
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                <span className="font-semibold">{questions.length}</span> questions,{' '}
                <span className="font-semibold">{totalPoints}</span> points
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-700">Passing Score:</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-center"
                />
                <span className="text-sm text-slate-600">%</span>
              </div>
              <button
                onClick={() => router.push(`/lms/modules/${module.id}`)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#EC5C29] text-white rounded-lg hover:bg-[#D54D1F] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Quiz'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, questionIndex) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-600">
                      Q{questionIndex + 1}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        question.type === 'multiple-choice'
                          ? 'bg-blue-100 text-blue-700'
                          : question.type === 'multi-select'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {question.type === 'multiple-choice'
                        ? 'Multiple Choice'
                        : question.type === 'multi-select'
                        ? 'Multi-Select'
                        : 'True/False'}
                    </span>
                    {question.correctAnswers.length === 0 && (
                      <span title="No correct answer set">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-4">
                    <label className="text-xs text-slate-600">Points:</label>
                    <input
                      type="number"
                      min="1"
                      value={question.points}
                      onChange={(e) =>
                        updateQuestion(questionIndex, { points: parseInt(e.target.value) || 1 })
                      }
                      className="w-12 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                    />
                  </div>
                  <button
                    onClick={() => moveQuestionUp(questionIndex)}
                    disabled={questionIndex === 0}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => moveQuestionDown(questionIndex)}
                    disabled={questionIndex === questions.length - 1}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteQuestion(questionIndex)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedQuestion(
                        expandedQuestion === questionIndex ? null : questionIndex
                      )
                    }
                    className="p-1 text-slate-600 hover:text-slate-900"
                  >
                    {expandedQuestion === questionIndex ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardHeader>

            {expandedQuestion === questionIndex && (
              <CardContent className="p-6 space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(questionIndex, { question: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Enter your question here..."
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Answer Options
                    {question.type === 'multi-select' && (
                      <span className="text-xs text-slate-500 ml-2">(Select all that apply)</span>
                    )}
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCorrectAnswer(questionIndex, option.id)}
                          className={`p-2 rounded-lg border-2 transition-all ${
                            question.correctAnswers.includes(option.id)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-slate-300 bg-white text-slate-400 hover:border-green-300'
                          }`}
                          title={
                            question.correctAnswers.includes(option.id)
                              ? 'Correct answer'
                              : 'Mark as correct'
                          }
                        >
                          {question.correctAnswers.includes(option.id) ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <HelpCircle className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder={`Option ${option.id.toUpperCase()}`}
                        />
                        {question.type !== 'true-false' && question.options.length > 2 && (
                          <button
                            onClick={() => deleteOption(questionIndex, optionIndex)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {question.type !== 'true-false' && (
                    <button
                      onClick={() => addOption(questionIndex)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      + Add option
                    </button>
                  )}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Explanation (Optional)
                  </label>
                  <textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(questionIndex, { explanation: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    placeholder="Provide an explanation that will be shown after the answer..."
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {questions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No questions yet</h3>
              <p className="text-slate-600 mb-4">Add your first question to start building your quiz</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => addQuestion('multiple-choice')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Multiple Choice
                </button>
                <button
                  onClick={() => addQuestion('true-false')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  True/False
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
