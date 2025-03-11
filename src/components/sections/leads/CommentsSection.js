/**
 * CommentsSection
 *
 * A single component that works for both:
 * 1) "Add" scenarios (no old comments to show)
 * 2) "Update" scenarios (old comments displayed read-only)
 *
 * Props:
 *  - showExistingComments: boolean => whether to display the old-comments block
 *  - existingComments: array of old comments (strings or objects with .text)
 *  - newCommentFields: array of items from useFieldArray for new comments
 *  - appendNewComment: function from useFieldArray to add a new comment object
 *  - removeNewComment: function from useFieldArray to remove a comment object
 *
 * Usage in Add Page:
 *   <CommentsSection
 *     showExistingComments={false}
 *     existingComments={[]}  // no old comments
 *     newCommentFields={newCommentFields}
 *     appendNewComment={appendNewComment}
 *     removeNewComment={removeNewComment}
 *   />
 *
 * Usage in Update Page:
 *   <CommentsSection
 *     showExistingComments={true}
 *     existingComments={existingComments} // old comments
 *     newCommentFields={newCommentFields}
 *     appendNewComment={appendNewComment}
 *     removeNewComment={removeNewComment}
 *   />
 */

import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CommentsSection({
                                            showExistingComments = false,
                                            existingComments = [],
                                            newCommentFields,
                                            prependNewComment,
                                            appendNewComment,
                                            removeNewComment,
                                        }) {
    // Local state for capturing the user's typed comment before it's appended
    const [tempComment, setTempComment] = useState("");

    /**
     * Appends a new comment object { text: string } to the field array,
     * provided the user typed a non-empty string.
     */
    const handleAddComment = () => {
        // at the comment to the first element and shift rest to the down like a stack
        if (!tempComment.trim()) return;
        prependNewComment({text: tempComment});
        setTempComment("");
    };

    /**
     * If the user presses Enter, prevent default form submission
     * and add the comment.
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Comments</h3>
            </div>
            <div className="card-body">
                {/* (1) Existing Comments (Read-only), if applicable */}
                {showExistingComments && (
                    <>
                        <h6 className="mb-2">Existing Comments (Read-Only)</h6>
                        {existingComments.length === 0 ? (
                            <p className="text-muted">No existing comments.</p>
                        ) : (
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {existingComments.map((comment, idx) => {
                                    // If old comments are strings, display them directly;
                                    // if they're objects, assume comment.text.
                                    const text = typeof comment === "string" ? comment : comment.text;
                                    return (
                                        <span
                                            key={idx}
                                            className="badge bg-secondary text-white fade-in"
                                            style={{fontSize: "0.9rem"}}
                                        >
                      {text}
                    </span>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* (2) New Comments (tag-like, removable) */}
                <h6 className="mb-2">New Comments (Unsaved)</h6>
                <p className="small text-muted">
                    You can remove these before saving if you change your mind.
                </p>
                {newCommentFields.length === 0 && (
                    <p className="text-muted">No new comments yet.</p>
                )}
                <div className="mb-2">
                    {newCommentFields.map((field, index) => (
                        <span
                            key={field.id}
                            className="badge bg-lime text-white me-2 mb-2 d-inline-flex align-items-center fade-in"
                            style={{fontSize: "0.9rem", transition: "opacity 0.3s ease"}}
                        >
              {field.text /* each item is { text: string } */}
                            <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                aria-label="Remove"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Remove this new comment"
                                style={{filter: "invert(100%)"}}
                                onClick={() => removeNewComment(index)}
                            />
            </span>
                    ))}
                </div>

                {/* (3) Input for adding a new comment */}
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type comment and press Enter"
                        value={tempComment}
                        onChange={(e) => setTempComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddComment}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
