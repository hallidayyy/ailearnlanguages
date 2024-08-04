import React from 'react';

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

  return (
    <div className="p-4">
      {questions.map((question, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-lg font-medium mb-2">{question.stem}</h3>
          <ul className="list-none">
            {Object.entries(question.options).map(([key, value]) => (
              <li key={key} className="mb-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={key}
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2">{key}. {value}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <span className="text-sm text-gray-600">Correct Answer: {question.answer}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsParser;