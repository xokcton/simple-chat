import { Skeleton, Stack } from '@chakra-ui/react'

const SKELETONS_AMOUNT = 12

const Skeletons = () => {
  return (
    <Stack>
      {
        [...new Array(SKELETONS_AMOUNT)].map((_, index) => (
          <Skeleton key={index} height="45px" />
        ))
      }
    </Stack>
  )
}

export default Skeletons