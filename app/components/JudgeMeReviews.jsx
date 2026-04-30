import { Stars } from '~/components/Stars';

export function JudgeMeBadge({ metafields }) {
  if (!metafields) return null;

  const reviewDataField = metafields.find(
    (m) =>
      m?.namespace === "judgeme" &&
      m?.key === "review_widget_data"
  );

  if (!reviewDataField?.value) return null;

  let rating = 0;
  let count = 0;

  try {
    const parsed = JSON.parse(reviewDataField.value);
    rating = parseFloat(parsed?.average_rating || 0);
    count = parseInt(parsed?.number_of_reviews || 0);
  } catch (e) {
    console.log("JudgeMe parse error", e);
    return null;
  }

  return (
    <a
      href="#reviews-section"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "8px",
        textDecoration: "none",
        cursor: "pointer"
      }}
    >
      <Stars rating={rating} size={16} />
      <span style={{ fontSize: "14px", color: "#6b7280" }}>
        {count} {count === 1 ? "review" : "reviews"}
      </span>
    </a>
  );
}