import { useId } from "react";

export function Stars({ rating, size = 16 }) {
  const gradientId = useId(); // unique per component

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= fullStars) {
          return <Star key={star} size={size} color="#1f9d8a" />;
        }
        if (star === fullStars + 1 && hasHalfStar) {
          return (
            <HalfStar
              key={star}
              size={size}
              gradientId={`${gradientId}-half`}
            />
          );
        }
        return <Star key={star} size={size} color="#d1d5db" />;
      })}
    </div>
  );
}

function Star({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.875 1.516 8.233L12 18.896l-7.452 4.518 1.516-8.233L0 9.306l8.332-1.151z" />
    </svg>
  );
}

function HalfStar({ size, gradientId }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="50%" stopColor="#1f9d8a" />
          <stop offset="50%" stopColor="#d1d5db" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.875 1.516 8.233L12 18.896l-7.452 4.518 1.516-8.233L0 9.306l8.332-1.151z"
      />
    </svg>
  );
}