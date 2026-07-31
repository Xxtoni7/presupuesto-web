import { useEffect, useMemo, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PropTypes from "prop-types";
import ReactQuill from "react-quill-new";
import { Redo2, Undo2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

const TAB_CHARACTER = "\t";

function createModules() {
    return {
        toolbar: [
            ["bold", "underline"],
            [{ list: "bullet" }, { list: "ordered" }],
        ],
        keyboard: {
            bindings: {
                customTab: {
                    key: 9,
                    handler(range) {
                        if (!range) return true;

                        if (range.length > 0) {
                            this.quill.deleteText(
                                range.index,
                                range.length,
                                "user"
                            );
                        }

                        this.quill.insertText(
                            range.index,
                            TAB_CHARACTER,
                            "user"
                        );

                        requestAnimationFrame(() => {
                            this.quill.setSelection(
                                range.index + TAB_CHARACTER.length,
                                0,
                                "api"
                            );
                        });

                        return false;
                    },
                },
            },
        },
        history: {
            delay: 500,
            maxStack: 100,
            userOnly: true,
        },
    };
}

const formats = [
    "bold",
    "underline",
    "list",
];

function RichTextEditor({ value, onChange, placeholder }) {
    const editorWrapperRef = useRef(null);
    const quillRef = useRef(null);

    const modules = useMemo(() => createModules(), []);

    useEffect(() => {
        const editor = quillRef.current?.getEditor();
        const toolbar = editorWrapperRef.current?.querySelector(".ql-toolbar");

        if (!editor || !toolbar) return;

        const alreadyHasHistoryControls = toolbar.querySelector(
            "[data-history-controls='true']"
        );

        if (alreadyHasHistoryControls) return;

        const controlsGroup = document.createElement("span");
        controlsGroup.className = "ql-formats";
        controlsGroup.dataset.historyControls = "true";

        const createHistoryButton = (label, Icon, onClick) => {
            const button = document.createElement("button");

            button.type = "button";
            button.title = label;
            button.setAttribute("aria-label", label);
            button.className = "ql-history-control";
            button.innerHTML = renderToStaticMarkup(<Icon size={16} />);

            button.addEventListener("click", onClick);

            return button;
        };

        const undoButton = createHistoryButton("Deshacer", Undo2, () => {
            editor.history.undo();
        });

        const redoButton = createHistoryButton("Rehacer", Redo2, () => {
            editor.history.redo();
        });

        controlsGroup.append(undoButton, redoButton);
        toolbar.prepend(controlsGroup);

        return () => {
            undoButton.remove();
            redoButton.remove();
            controlsGroup.remove();
        };
    }, []);

    return (
        <div className="mt-1.5">
            <div
                ref={editorWrapperRef}
                className="app-rich-text-editor flex w-full flex-col rounded-lg border border-input bg-background text-foreground shadow-sm focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20"
            >
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    className="
                        [&_.ql-toolbar]:sticky
                        [&_.ql-toolbar]:top-0
                        [&_.ql-toolbar]:z-10
                        [&_.ql-toolbar]:rounded-t-lg
                        [&_.ql-toolbar]:bg-background
                        [&_.ql-toolbar]:!border-0
                        [&_.ql-toolbar]:!border-b
                        [&_.ql-toolbar]:!border-border

                        [&_.ql-toolbar_.ql-history-control]:text-muted-foreground
                        [&_.ql-toolbar_.ql-history-control:hover]:text-foreground

                        [&_.ql-container]:border-0

                        [&_.ql-editor]:min-h-[90px]
                        [&_.ql-editor]:px-3
                        [&_.ql-editor]:py-2
                        [&_.ql-editor]:text-sm
                        [&_.ql-editor]:text-foreground
                        [&_.ql-editor]:whitespace-pre-wrap
                        [&_.ql-editor]:[tab-size:4]

                        [&_.ql-editor.ql-blank::before]:text-muted-foreground
                        [&_.ql-editor.ql-blank::before]:not-italic
                    "
                />
            </div>
        </div>
    );
}

RichTextEditor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

RichTextEditor.defaultProps = {
    placeholder: "",
};

export default RichTextEditor;