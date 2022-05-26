import React from 'react';
import { Box, Image, Text, VStack, Skeleton } from '@chakra-ui/react';
import moment from 'moment';
import { Carousel } from 'react-responsive-carousel';
import {
  LazyLoadComponent,
  trackWindowScroll,
} from 'react-lazy-load-image-component';

const placeholderImage = <Skeleton w={'100%'} h={'350px'} />;

function PostBase({ location, caption, created, images, scrollPosition }) {
  return (
    <Box
      maxW={'xl'}
      w={'100%'}
      borderWidth={'1px'}
      borderRadius={'lg'}
      overflow={'hidden'}
    >
      {images.length > 1 ? (
        <Carousel
          showThumbs={false}
          showStatus={false}
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={30}
        >
          {images.map((image, idx) => (
            <LazyLoadComponent
              key={idx}
              placeholder={placeholderImage}
              scrollPosition={scrollPosition}
            >
              <Image src={image} />
            </LazyLoadComponent>
          ))}
        </Carousel>
      ) : (
        <LazyLoadComponent
          placeholder={placeholderImage}
          scrollPosition={scrollPosition}
        >
          <Image src={images[0]} />
        </LazyLoadComponent>
      )}
      <Box p={6}>
        <Box
          color="gray.500"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
        >
          {location} &bull; {moment(created.toDate()).fromNow()}
        </Box>
        <Box mt={2}>{caption}</Box>
      </Box>
    </Box>
  );
}

const Post = trackWindowScroll(PostBase);

function Posts({ posts }) {
  if (posts.length === 0) {
    return (
      <Text fontSize={'2xl'} textAlign={'center'}>
        No posts yet
      </Text>
    );
  }

  return (
    <VStack spacing={4}>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </VStack>
  );
}

export default Posts;
