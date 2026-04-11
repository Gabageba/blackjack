import { type ReactNode } from 'react';
import styles from './styles';

type IProps = {
  type?: 'default' | 'primary' | 'muted' | 'danger' | 'outlined';
  disabled?: boolean;
  onClick: () => void;
  children?: ReactNode;
};

const btnClasses = {
  default: styles().btnDefault,
  primary: styles().btnPrimary,
  muted: styles().btnMuted,
  danger: styles().btnDanger,
  outlined: styles().btnOutlined,
};

function Button({ type = 'default', disabled, onClick, children }: IProps) {
  return (
    <button
      type="button"
      css={[styles().btn, btnClasses[type]]}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
