import { ComponentProps } from "react"
import { Container } from "./styles"

type ButtonProps = ComponentProps<typeof Container>

export const Button = ({children, ...props}: ButtonProps) => {

    return (
        <Container {...props}>{children || 'Button'}</Container>
    )
}