import React from 'react';
import { Email, Item} from 'react-html-email';
export default function InlineLink({text}) {
  return (
  <Email title='link'>
    <Item>
       Rénitialisation de votre mot de passe
    </Item>
    <Item>
      {text}
    </Item>
  </Email>
)};
