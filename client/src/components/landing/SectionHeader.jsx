import PropTypes from "prop-types";

function SectionHeader({
  number,
  eyebrow,
  title,
  description,
  centered = false,
  className = "",
}) {
  return (
    <div
      className={`max-w-3xl ${
        centered ? "mx-auto text-center" : ""
      } ${className}`}
    >
      <div
        className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent ${
          centered ? "justify-center" : ""
        }`}
      >
        {number && (
          <span className="font-serif text-sm italic font-normal text-gold">
            {number}
          </span>
        )}
        {number && <span className="text-border-strong">/</span>}
        <span>{eyebrow}</span>
      </div>

      <h2 className="display-lg text-espresso mt-3 font-normal leading-[1.12]">
        {title}
      </h2>

      {description && (
        <p className="text-brown/80 text-base sm:text-lg leading-relaxed mt-4 font-light">
          {description}
        </p>
      )}
    </div>
  );
}

SectionHeader.propTypes = {
  number: PropTypes.string,
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  centered: PropTypes.bool,
  className: PropTypes.string,
};

export default SectionHeader;
