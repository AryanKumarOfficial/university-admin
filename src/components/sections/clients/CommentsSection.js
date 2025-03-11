import React, {useState} from "react";

export default function CommentsSection({
                                            existingComments = [],
                                            newCommentFields,
                                            appendNewComment,
                                            removeNewComment,
                                            prependNewComment
                                        }) {
    const [tempComment, setTempComment] = useState("");

    const handleAddComment = () => {
        if (!tempComment.trim()) return;
        // If storing as { text: string }
        prependNewComment({text: tempComment.trim()});
        setTempComment("");
    };

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
                {/* Existing Comments (Read-only) */}
                <h6>Existing Comments</h6>
                {existingComments.length === 0 ? (
                    <p className="text-muted">No existing comments.</p>
                ) : (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {existingComments.map((cmt, idx) => {
                            const text = typeof cmt === "string" ? cmt : cmt.text;
                            return (
                                <span key={idx} className="badge bg-secondary text-white">
                  {text}
                </span>
                            );
                        })}
                    </div>
                )}

                {/* New Comments */}
                <h6>New Comments (Unsaved)</h6>
                {newCommentFields.length === 0 && <p className="text-muted">No new comments yet.</p>}
                <div className="mb-2">
                    {newCommentFields.map((field, index) => (
                        <span
                            key={field.id}
                            className="badge bg-lime text-dark me-2 mb-2 d-inline-flex align-items-center"
                        >
              {field.text}
                            <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                aria-label="Remove"
                                style={{filter: "invert(100%)"}}
                                onClick={() => removeNewComment(index)}
                            />
            </span>
                    ))}
                </div>

                {/* Add Comment Input */}
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type comment and press Enter"
                        value={tempComment}
                        onChange={(e) => setTempComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button type="button" className="btn btn-primary" onClick={handleAddComment}>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
