const variants = {
  login: {
    title: "text-lg text-center text-gray-500",
    desc: "text-gray-500 text-center text-sm",
  },
  dark: {
    title: "text-2xl p-2 text-center text-gray-600",
    desc: "text-gray-500 text-center text-sm",
  },
  page: {
    title: "text-2xl tracking-tight text-gray-800 sm:text-3xl",
    desc: "mt-2 text-sm text-gray-500",
  },
};

export function Heading({ title, desc, as: Tag = "h1", className = "", variant = "login", id }) {
  const styles = variants[variant] ?? variants.login;

  return (
    <div>
      <Tag id={id} className={[styles.title, className].filter(Boolean).join(" ")}>
        {title}
      </Tag>
      {desc && <p className={styles.desc}>{desc}</p>}
    </div>
  );
}
