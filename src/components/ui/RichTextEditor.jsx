import PropTypes from "prop-types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
    toolbar: [
        ["bold", "underline"],
        [{ list: "bullet" }, { list: "ordered" }],
    ],
};

function RichTextEditor({ value, onChange, placeholder }) {
    return (
        <div className="mt-1.5">
            <div className="flex w-full flex-col rounded-lg border border-[#d1d5db] bg-white shadow-sm focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={modules}
                    placeholder={placeholder}
                    className="
                        [&_.ql-toolbar]:sticky
                        [&_.ql-toolbar]:top-0
                        [&_.ql-toolbar]:z-10
                        [&_.ql-toolbar]:bg-white
                        [&_.ql-toolbar]:border-0
                        [&_.ql-toolbar]:border-b
                        [&_.ql-toolbar]:border-[#e5e7eb]

                        [&_.ql-container]:border-0

                        [&_.ql-editor]:min-h-[90px]
                        [&_.ql-editor]:px-3
                        [&_.ql-editor]:py-2
                        [&_.ql-editor]:text-sm
                        [&_.ql-editor]:text-[#111111]

                        [&_.ql-editor.ql-blank::before]:text-[#9ca3af]
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