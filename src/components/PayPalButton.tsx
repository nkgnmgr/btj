export default function PayPalButton() {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <a
        href="https://www.paypal.com/ncp/payment/4TTUYSMPYKY8A"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderLeft: "none",
          borderRadius: "0 6px 6px 0",
          padding: "10px 8px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.08)",
          textDecoration: "none",
          color: "#003087",
          transition: "box-shadow 0.2s",
        }}
        title="Support this site via PayPal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          style={{ display: "block" }}
        >
          <path
            fill="#003087"
            d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.477z"
          />
          <path
            fill="#009cde"
            d="M21.222 6.917a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.477z"
          />
        </svg>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "#003087",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            marginTop: "4px",
          }}
        >
          Donate
        </span>
      </a>
    </div>
  );
}
