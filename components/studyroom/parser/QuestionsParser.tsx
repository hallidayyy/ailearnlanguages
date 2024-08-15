import React, { useState } from 'react';

interface Question {
  stem: string;
  options: {
    [key: string]: string;
  };
  answer: string;
}

interface QuestionsParserProps {
  content: string;
}

const QuestionsParser: React.FC<QuestionsParserProps> = ({ content }) => {
  let json;
  try {
    json = JSON.parse(content);
  } catch (e) {
    console.error('JSON Parsing Error:', e);
    return <div>Invalid JSON</div>;
  }

  if (!json || !Array.isArray(json.questions)) {
    return <div>No questions available</div>;
  }

  const questions: Question[] = json.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setIsAnswerCorrect(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsAnswerCorrect(null);
      }, 1000); // Delay to show the correct answer message
    } else {
      setIsAnswerCorrect(false);
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">quiz completed</h2>
        <p className="text-lg">
          you answered {questions.length} questions and got {wrongAnswers} wrong
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">{currentQuestion.stem}</h3>
        <form onSubmit={handleSubmit}>
          <ul className="list-none">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <li key={key} className="mb-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="question"
                    value={key}
                    checked={selectedOption === key}
                    onChange={handleOptionChange}
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2">{key}. {value}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              submit
            </button>
          </div>
        </form>
        {isAnswerCorrect !== null && (
          <div className="mt-4">
            {isAnswerCorrect ? (
              <span className="text-sm text-green-600">correct</span>
            ) : (
              <span className="text-sm text-red-600">incorrect, try again</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsParser;