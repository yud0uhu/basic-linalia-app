# Example

**参考資料**

[docs/BASICS.md](https://github.com/callstack/linaria/blob/master/docs/BASICS.md)
[研修で Linaria を使って CSS in JS した話](https://inside.dmm.com/articles/ad-cal-linaria/)

### 基本文法

[テンプレートリテラル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Template_literals)を用いて記述する

- テンプレート リテラル

```tsx
const message = `
This is a template literal.
This is an interpolation: ${answer}.
`;
```

- タグ付きテンプレートリテラル

```tsx
const message = someTag`This is a tagged template literal`;
```

- css タグ

```tsx
import { css } from "@linaria/core";

// Create a class name
const title = css`
  font-size: 24px;
  font-weight: bold;
`;

function Heading() {
  // Pass it to a component
  return <h1 className={title}>This is a title</h1>;
}
```

- styled タグ

```tsx
import { styled } from "@linaria/react";

// Create a styled component
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

function Heading() {
  // Use the styled component
  return <Title>This is a title</Title>;
}
```

### css タグで dynamic な style は作れない

- このようには書けない

```tsx
// styled-components
type TextStyle = "body1" | "body2";
const textCss = css<{ textStyle: TextStyle }>`
  font-size: ${(props) => fontSizeMap[props.textStyle]}px;
`;
```

- 式の挿入

ここで、`fontSize`変数はビルド時に評価され、生成された CSS に挿入される(ゼロランタイム)

```tsx
const fontSize = 16;

const Title = styled.h1`
  font-size: ${fontSize}px;
`;
```

オブジェクトの補間も可能

```tsx
const cover = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  opacity: 1,
  minHeight: 360,

  "@media (min-width: 200px)": {
    minHeight: 480,
  },
};

const Title = styled.h1`
  font-size: 24px;

  ${cover};
`;
```

- オブジェクトには以下の要素を含めることができる

  - ネストされたセレクター
  - メディア クエリ
  - 擬似セレクター、および擬似要素

- 単位が必要な数値 (minHeight 上記の例など) は、指定しない限り`px`が付加される

[docs/BASICS.md#interpolations](https://github.com/callstack/linaria/blob/master/docs/BASICS.md#interpolations) より

- スタイルのオーバーライド

```tsx
const Button = styled.button`
  font-size: 14px;
  background-color: tomato;
  padding: 8px;
  box-shadow: 0 0.5px 0.3px rgba(0, 0, 0, 0.1);
`;

// コンポーネントをstyledタグで囲み、オーバーライドすることができる
const LargeButton = styled(Button)`
  font-size: 18px;
  padding: 16px;
`;
```

```tsx
function CoolComponent({ className, style, ...rest }) {
  return (
    <div className={className} style={style}>
      {...}
    </div>
  );
}

// カスタムコンポーネントをstyledタグで囲み、オーバーライドすることができる
const StyledCoolComponent = styled(CoolComponent)`
  background-color: tomato;
`;
```

- props を使って css 変数を動的に変化させる

```tsx
import { Card } from "some-library";

function CustomCard({ className, style, ...rest }) {
  return (
    <div style={style}>
      <Card className={className} {...rest} />
    </div>
  );
}

const StyledCustomCard = styled(CustomCard)`
  margin: 16px;
  height: ${(props) => props.height}px;
`;
```

### 動的に CSS スタイルを変更する

**参考資料**
[docs/DYNAMIC_STYLES.md](https://github.com/callstack/linaria/blob/v2.1.0/docs/DYNAMIC_STYLES.md)

- インラインスタイル

疑似セレクターやメディア クエリでインライン スタイルを使用することはできない

```tsx
import React from "react";

export function Pager({ index, children }) {
  return (
    <div style={{ transform: `translateX(${index * 100}%)` }}>{children}</div>
  );
}
```

- CSS カスタムプロパティを使う

```tsx
import React from "react";
import { css } from "linaria";

const box = css`
  height: var(--box-size);
  width: var(--box-size);
`;

export function Box({ size }) {
  return <div className={box} style={{ "--box-size": size }} />;
}
```

- [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes)を使う(事前に値が定まっている場合)

```tsx
import React from "react";
import { css } from "linaria";

const box = css`
  &[data-valid] {
    color: yellow;
  }
  &[data-valid="invalid"] {
    color: red;
  }
  &[data-valid="valid"] {
    color: green;
  }
`;

export function Box({ color, valid }) {
  return <div className={box} data-valid={valid ? "valid" : "invalid"} />;
}
```

## 例 : 動的に style を書き換える

```tsx
// example/components/LinaliaButton.tsx
import React, { useState } from "react";
import { styled } from "@linaria/react";

const StyledButton = styled.button`
  &[data-valid] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 240px;
    height: 48px;
    border-radius: 50px;
    background-color: rgb(245, 205, 0);
    color: rgb(0, 0, 0);
    font-weight: 700;
    padding: 0.25em 1em;
    cursor: pointer;
    transition: all 0.2s;
  }

  &[data-valid="before"]::before,
  &[data-valid="active"]::before {
    content: "🐻";
    display: inline-block;
    padding-right: 0.5em;
  }

  &[data-valid="active"] {
    transition-duration: 0.2s;
    box-shadow: 0 0 0.2em #0003;
    transform: scale(0.95);
    filter: brightness(0.9) contrast(1.2);
  }

  @media screen and (max-width: 360px) {
    &[data-valid="before"]::before {
      content: "🐱";
    }
  }
`;

const LinaliaButton: React.FC = () => {
  const [status, setStatus] = useState("before");

  const handleClick = () => {
    setStatus("active");
    setTimeout(() => setStatus("before"), 200);
  };

  return (
    <StyledButton data-valid={status} onClick={handleClick}>
      Click me
    </StyledButton>
  );
};

export default LinaliaButton;
```

CSS Modules におけるクラスセレクタは、ブラウザ上で一意のクラス名に自動変換される

```css
sbkdnyv:active {
  transition-duration: 0.05s;
  box-shadow: 0 0 0.2em #0003;
  transform: scale(0.95);
  filter: brightness(0.9) contrast(1.2);
}
.sbkdnyv {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 48px;
  border-radius: 50px;
  background-color: rgb(245, 205, 0);
  color: rgb(0, 0, 0);
  font-weight: 700;
  padding: 0.25em 1em;
  cursor: pointer;
  transition: all 0.2s;
}
```
