export default function WriteReviewButton({ product }) {
  if (!product?.id) return null;

  // Shopify Global ID → numeric ID extract
  const numericId = product.id.split("/").pop();

  // Judge.me dynamic link
  const reviewLink = `https://judge.me/product_reviews/b549e4cd-85c8-47fe-bf4c-3ee7ad4d5d38/new?id=${numericId}&source=shareable-link`;

  return (
    <div style={{ marginTop: "20px" }}>
      <a
        href={reviewLink}
        rel="noopener noreferrer"
        style={{
          padding: "10px 18px",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Write a Review
      </a>
    </div>
  );
}