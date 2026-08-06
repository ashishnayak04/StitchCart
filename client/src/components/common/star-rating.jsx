import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
  return [1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      className={`p-1 transition-all ${
        star <= rating ? "text-accent" : "text-beige"
      }`}
      onClick={handleRatingChange ? () => handleRatingChange(star) : undefined}
      type="button"
    >
      <StarIcon
        className={`w-5 h-5 ${
          star <= rating ? "fill-accent" : "fill-transparent"
        }`}
      />
    </button>
  ));
}

export default StarRatingComponent;
