interface IProps {
  text: string;
}

export default function NoResults({ text }: IProps) {
  return <div>{text}</div>;
}
