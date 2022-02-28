import React from 'react';
import { Box, Image, Text, VStack } from '@chakra-ui/react';
import moment from 'moment';
import { Carousel } from 'react-responsive-carousel';

function Post({ location, caption, created, images }) {
  return (
    <Box maxW={'xl'} w={'100%'} borderWidth={'1px'} borderRadius={'lg'} overflow={'hidden'}>
      {images.length > 1 ?
        <Carousel showThumbs={false} showStatus={false}>
          {images.map((image, idx) => <Image key={idx} src={image} />)}
        </Carousel> :
        <Image src={images[0]} />}
      <Box p={6}>
        <Box
          color='gray.500'
          fontWeight='semibold'
          letterSpacing='wide'
          fontSize='xs'
          textTransform='uppercase'
        >
          {location} &bull; {moment(created.toDate()).fromNow()}
        </Box>
        <Box mt={2}>
          {caption}
        </Box>
      </Box>
    </Box>
  );
}

function Posts({ posts }) {
  if (posts.length === 0) {
    return <Text fontSize={'2xl'} textAlign={'center'}>No posts yet</Text>;
  }

  return (
    <VStack spacing={4}>
      {posts.map(post => <Post key={post.id} {...post} />)}
    </VStack>
  );
}

export default Posts;