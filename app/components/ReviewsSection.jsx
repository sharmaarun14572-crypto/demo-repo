import { Stars } from "./Stars";
export function ReviewsSection({ metafields }) {
  const reviewsField = metafields?.find(
    (m) => m?.key === "reviews"
  );

  const ratingField = metafields?.find(
    (m) => m?.key === "rating"
  );

  const countField = metafields?.find(
    (m) => m?.key === "rating_count"
  );

  if (!reviewsField) return null;

  const parsedRating = JSON.parse(ratingField?.value || "{}");
  const rating = parseFloat(parsedRating?.rating || 0);
  const count = parseInt(countField?.value || 0);

  return (
    <div id="reviews-section" style={{ marginTop: "60px" }}>
      checking
      <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>
        Customer Reviews
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "18px", fontWeight: "600" }}>
          {rating} ({count} reviews)
        </div>
       <Stars rating={rating} size={16} />
      </div>

      {/* Reviews HTML from metafield */}
      <div
        dangerouslySetInnerHTML={{
          __html: reviewsField.value
        }}
      />
    </div>
  );
}