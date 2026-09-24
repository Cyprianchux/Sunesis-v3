const allowedTag = /^<\/?(div|p|br|strong|b|em|i|ul|ol|li)(?:\s[^>]*)?>$/i;

export function sanitizeRichText(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]*>/g, (tag) => {
      const match = tag.match(allowedTag);
      return match ? `<${tag.startsWith("</") ? "/" : ""}${match[1]}>` : "";
    });
}

export function plainTextToRichHtml(value: string) {
  const lines = value.split(/\r?\n/);
  let html = "";
  let bullets: string[] = [];
  const flushBullets = () => {
    if (bullets.length) {
      html += `<ul>${bullets.join("")}</ul>`;
      bullets = [];
    }
  };
  lines.forEach((line) => {
    const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (line.startsWith("- ")) bullets.push(`<li>${escaped.slice(2)}</li>`);
    else {
      flushBullets();
      html += `<div>${escaped || "<br />"}</div>`;
    }
  });
  flushBullets();
  return html;
}

export function descriptionToHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value) ? sanitizeRichText(value) : plainTextToRichHtml(value);
}
