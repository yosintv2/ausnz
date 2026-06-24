import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url });
    }
  };

  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, bg: "bg-[#1877F2]" },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encoded}`, bg: "bg-[#25D366]" },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`, bg: "bg-black" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, bg: "bg-[#0A66C2]" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button onClick={nativeShare}
          className="flex items-center gap-1.5 bg-[#0B2545] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#112d5e] transition-colors">
          <Share2 className="w-3 h-3" /> Share
        </button>
      )}
      {links.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
          className={`${link.bg} text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity`}
          aria-label={`Share on ${link.label}`}>{link.label}</a>
      ))}
      <button onClick={copyLink}
        className="flex items-center gap-1.5 bg-[#F4F6F9] border border-[#E2E6ED] text-[#1A1A2E] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors">
        {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
