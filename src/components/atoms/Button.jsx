import clsx from "clsx";

const STYLES = {
  long: "block w-full max-w-96 h-14 p-4 bg-sky-500 text-white font-semibold rounded-xl disabled:bg-gray-300 disabled:text-gray-500",
  longwhite:
    "block w-full max-w-96 h-14 p-4 bg-white text-black font-semibold rounded-xl",
  small: "block h-14 p-4 bg-sky-100 text-primary font-semibold rounded-xl",
  addPhoto:
    "flex items-center px-3.5 py-1 border border-gray-300 bg-gray-100 rounded-full text-xs",
  deletePhoto: "w-6 h-6 bg-gray-100 rounded-full text-xs",
  withTextInput: "w-28 h-14 px-4 rounded-xl bg-sky-100 text-sky-500",
  cta: "block px-7 py-4 bg-primary text-white font-semibold rounded-full",
  demo: "shrink-0 px-3 py-2 bg-sky-500 text-white text-sm font-semibold rounded-lg whitespace-nowrap",
  aside:
    "h-16 p-4 text-xl font-semibold text-white bg-gray-700 shadow-xl rounded-xl",
};

const Button = ({ variant, className, children, ...props }) => {
  return (
    <button className={clsx(STYLES[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
