import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    surveyTitle: '',
    questions: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addQuestion = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, { id: Date.now(), type, text: '', options: [] }],
    }));
  };

  const handleQuestionChange = (id, field, value) => {
    setFormData((prevData) => {
      const updatedQuestions = prevData.questions.map((question) =>
        question.id === id ? { ...question, [field]: value } : question
      );
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
  };

  const addOption = (questionId) => {
    setFormData((prevData) => {
      const updatedQuestions = prevData.questions.map((question) =>
        question.id === questionId ? { ...question, options: [...question.options, ''] } : question
      );
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setFormData((prevData) => {
      const updatedQuestions = prevData.questions.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options.slice(0, optionIndex), value, ...question.options.slice(optionIndex + 1)] }
          : question
      );
      return {
        ...prevData,
        questions: updatedQuestions,
      };
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedQuestions = Array.from(formData.questions);
    const [reorderedItem] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, reorderedItem);

    setFormData((prevData) => ({
      ...prevData,
      questions: reorderedQuestions,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for submitting the survey data
    console.log('Survey Data:', formData);
  };

  return (
    <div>
      <h1>Advanced Survey Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Survey Title:
          <input
            type="text"
            name="surveyTitle"
            value={formData.surveyTitle}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {formData.questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div>
                          <label>
                            Question {index + 1}:
                            <input
                              type="text"
                              value={question.text}
                              onChange={(e) =>
                                handleQuestionChange(question.id, 'text', e.target.value)
                              }
                              required
                            />
                          </label>
                          <br />

                          {question.type === 'text' && <p>Text Input</p>}
                          {question.type === 'radio' && (
                            <div>
                              <p>Radio Buttons</p>
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                  <label>
                                    <input
                                      type="radio"
                                      name={`q${question.id}`}
                                      value={option}
                                      onChange={(e) =>
                                        handleOptionChange(question.id, optionIndex, e.target.value)
                                      }
                                      required
                                    />
                                    {` Option ${optionIndex + 1}`}
                                  </label>
                                </div>
                              ))}
                              <button type="button" onClick={() => addOption(question.id)}>
                                Add Option
                              </button>
                            </div>
                          )}
                          {question.type === 'checkbox' && (
                            <div>
                              <p>Checkboxes</p>
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      value={option}
                                      onChange={(e) =>
                                        handleOptionChange(question.id, optionIndex, e.target.value)
                                      }
                                      required
                                    />
                                    {` Option ${optionIndex + 1}`}
                                  </label>
                                </div>
                              ))}
                              <button type="button" onClick={() => addOption(question.id)}>
                                Add Option
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div>
          <label>
            Add a Question:
            <select
              value=""
              onChange={(e) => addQuestion(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Question Type
              </option>
              <option value="text">Text Input</option>
              <option value="radio">Radio Buttons</option>
              <option value="checkbox">Checkboxes</option>
            </select>
          </label>
        </div>

        <br />
        <button type="submit">Submit Survey</button>
      </form>
    </div>
  );
};

export default SurveyForm;
