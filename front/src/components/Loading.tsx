import React, { memo, PropsWithChildren } from "react";
// import { LoaderHeightWidthRadiusProps } from "react-spinners/interfaces";
import ScaleLoader from "react-spinners/ScaleLoader";
// import styled from "styled-components";

interface Props {
  loading?: boolean;
}

// const Center = styled.div``;
export const Loading: React.FC<PropsWithChildren<Props>> = memo(
  ({ loading, children, ...props }) => {
    return (
      <>
        <ScaleLoader
          color="#678de5"
          css={
            "width: 100%; display: flex; flex-direction: row; justify-content: center; "
          }
          loading={loading}
        />

        <div hidden={loading}>{children}</div>
      </>
    );
  }
);

Loading.defaultProps = {
  loading: true,
};
