// src/components/SurveyForm.jsx

import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './SurveyForm.css'; // Import the CSS file

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    surveyTitle: '',
    questions: [],
    selectedQuestionType: 'text', // Initialize with 'text'
  });




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addQuestion = (type) => {
    setFormData((prevData) => {
      const newQuestion = {
        id: Date.now(),
        type,
        text: '',
        answer: '',
        options: type === 'text' ? [] : [''],
      };
  
      return {
        ...prevData,
        questions: [...prevData.questions, newQuestion],
        selectedQuestionType: type, // Ensure selectedQuestionType is updated
      };
    });
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
          ? {
              ...question,
              options: [
                ...question.options.slice(0, optionIndex),
                value,
                ...question.options.slice(optionIndex + 1),
              ],
            }
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

    // Generate the form content
    const formContent = JSON.stringify(formData, null, 2); // Convert the form data to JSON with proper formatting

    // Create a Blob containing the form content
    const blob = new Blob([formContent], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');

    // Set the link's attributes
    link.href = window.URL.createObjectURL(blob);
    link.download = 'survey-form.json'; // Set the desired file name

    // Append the link to the document body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document body
    document.body.removeChild(link);

    // Optionally, you can clear the form data after submission
    setFormData({
      surveyTitle: '',
      questions: [],
    });

    // Optionally, display a confirmation message
    alert('Survey Form Downloaded!');
  };

  return (
    <div className="container">
      <h1 className="header">Advanced Survey Form</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="label">
          Survey Title:
          <input
            type="text"
            name="surveyTitle"
            value={formData.surveyTitle}
            onChange={handleInputChange}
            required
            className="input"
          />
        </label>
        <br />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions" direction="vertical">
            {(provided) => (
              <div className="question-container" {...provided.droppableProps} ref={provided.innerRef}>
                {formData.questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        className="question"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div>
                          <label className="question-label">
                            Question {index + 1}:
                            <input
                              type="text"
                              value={question.text}
                              onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                              required
                              className="question-input"
                            />
                          </label>
                          <br />

                          {question.type === 'text' && (
                            <label className="question-label">
                              Answer:
                              <input
                                type="text"
                                value={question.answer || ''}
                                onChange={(e) => handleQuestionChange(question.id, 'answer', e.target.value)}
                                required
                                className="question-input"
                              />
                            </label>
                          )}
                          {question.type === 'radio' && (
                            <div>
                              <p>Radio Buttons</p>
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="option">
                                  <label>
                                    <input
                                      type="radio"
                                      name={`q${question.id}`}
                                      value={option}
                                      onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                      required
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                      required
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                  </label>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addOption(question.id)}
                                className="add-option-btn"
                              >
                                Add Option
                              </button>
                            </div>
                          )}

                        {question.type === 'checkbox' && (
                          <div>
                            <p>Checkboxes</p>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="option">
                                <label>
                                  <input
                                    type="checkbox"
                                    value={option}
                                    onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                    // Remove the "required" attribute
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                </label>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(question.id)}
                              className="add-option-btn"
                            >
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

        <div className="options-container">
          <label className="label">
            Add a Question:
            <select
              value={formData.selectedQuestionType}
              onChange={(e) => addQuestion(e.target.value)}
              required
              className="input"
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
        <button type="submit" className="submit-btn">
          Submit Survey
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
