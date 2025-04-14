export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex justify-center items-center text-sm font-medium';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button type={type} className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
