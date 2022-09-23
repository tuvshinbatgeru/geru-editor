import React from "react"
import { styled } from "baseui"
import { Theme } from "baseui/theme"
import Common from "./Common"

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  background: $theme.colors.white,
}))

export default function () {
  return (
    <Container>
      <Common />
    </Container>
  )
}
