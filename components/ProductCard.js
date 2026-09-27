import Link from "next/link";

export default function ProductCard({ listing }) {
  const priceFormatted = Number(listing.price).toLocaleString("en-NG");
  return (
    <Link href={`/listing/${listing.id}`} className="pcard">
      <div
        className="pcard-img"
        style={
          listing.image_url
            ? { backgroundImage: `url(${listing.image_url})` }
            : {}
        }
      >
        {!listing.image_url && "🛍️"}
      </div>
      <div className="pcard-body">
        <p className="name">{listing.title}</p>
        <p className="price">₦{priceFormatted}</p>
        <p className="meta">📍 {listing.location}</p>
      </div>
    </Link>
  );
}
