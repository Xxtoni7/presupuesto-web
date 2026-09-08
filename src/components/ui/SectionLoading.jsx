import PropTypes from "prop-types";

function SectionLoading({ message = "Cargando..." }) {
    return (
        <div className="py-12 text-center">
            <div
                aria-hidden="true"
                className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary motion-reduce:animate-none"
            />
            <output className="text-sm text-muted-foreground">
                {message}
            </output>
        </div>
    );
}

SectionLoading.propTypes = {
    message: PropTypes.string,
};

export default SectionLoading;
