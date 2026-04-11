import { css } from '@emotion/react';

const styles = () => ({
  self: css`
    display: flex;
    flex-flow: column wrap;
    gap: 10px;
    justify-content: center;
    width: 100%;
    max-width: min(400px, 100%);
    box-sizing: border-box;
    padding: 0 4px;
  `,
  actions: css`
    display: flex;
    gap: 10px;

    button {
      width: 100%;
    }
  `,
});

export default styles;
