import { Flex, IconButton, Icon, Tooltip, Link } from "@chakra-ui/react";
import { BsTwitter, BsDiscord } from "react-icons/bs";
import { SiOpensea } from "react-icons/si";
import { IoHomeSharp } from "react-icons/io5";
import { config } from "@/config";

export default function Socials({ ...props }) {
  return (
    <Flex justifyItems={"center"} align={"center"} gap={3} {...props}>
      <Tooltip label="Homepage">
        <Link href={"https://impossibletrios.art"} isExternal>
          <IconButton
            variant={"ghost"}
            _hover={{ backgroundColor: "nw-yellow", color: "black" }}
            fontSize="26px"
            size={"lg"}
            aria-label="Home"
            icon={<Icon as={IoHomeSharp} />}
          />
        </Link>
      </Tooltip>
      <Tooltip label="Twitter / X">
        <Link href={"https://twitter.com/nightwatchwalks"} isExternal>
          <IconButton
            variant={"ghost"}
            _hover={{ backgroundColor: "nw-yellow", color: "black" }}
            size={"lg"}
            aria-label="Twitter"
            fontSize="26px"
            icon={<Icon as={BsTwitter} />}
          />
        </Link>
      </Tooltip>
      <Tooltip label="Discord">
        <Link href={"https://discord.gg/nightwatch"} isExternal>
          <IconButton
            variant={"ghost"}
            size={"lg"}
            _hover={{ backgroundColor: "nw-yellow", color: "black" }}
            fontSize="26px"
            aria-label="Discord"
            icon={<Icon as={BsDiscord} />}
          />
        </Link>
      </Tooltip>
      <Tooltip label="OpenSea">
        <Link href={"https://opensea.io/collection/nightwatchwalks"} isExternal>
          <IconButton
            variant={"ghost"}
            fontSize="26px"
            size={"lg"}
            _hover={{ backgroundColor: "nw-yellow", color: "black" }}
            aria-label="OpenSea"
            icon={<Icon as={SiOpensea} />}
          />
        </Link>
      </Tooltip>
      <Tooltip label="Etherscan">
        <Link
          href={"https://etherscan.io/address/" + config.addresses.nightWatch}
          isExternal
        >
          <IconButton
            variant={"ghost"}
            fontSize="26px"
            size={"lg"}
            _hover={{ backgroundColor: "nw-yellow", color: "black" }}
            aria-label="Etherscan"
            icon={<EtherscanIcon color={undefined} />}
          />
        </Link>
      </Tooltip>
    </Flex>
  );
}

function EtherscanIcon({ color, ...props }) {
  return (
    <Icon viewBox={"0 0 122 122"} fill={"currentColor"} {...props}>
      <path
        d="M25.29 57.9139C25.2901 57.2347 25.4244 56.5623 25.6851 55.9352C25.9458 55.308 26.3278 54.7386 26.8092 54.2595C27.2907 53.7804 27.8619 53.4011 28.4903 53.1434C29.1187 52.8858 29.7918 52.7548 30.471 52.7579L39.061 52.7859C40.4305 52.7859 41.744 53.33 42.7124 54.2984C43.6809 55.2669 44.225 56.5803 44.225 57.9499V90.4299C45.192 90.1429 46.434 89.8369 47.793 89.5169C48.737 89.2952 49.5783 88.761 50.1805 88.0009C50.7826 87.2409 51.1102 86.2996 51.11 85.3299V45.0399C51.11 43.6702 51.654 42.3567 52.6224 41.3881C53.5908 40.4195 54.9043 39.8752 56.274 39.8749H64.881C66.2506 39.8752 67.5641 40.4195 68.5325 41.3881C69.5009 42.3567 70.045 43.6702 70.045 45.0399V82.4329C70.045 82.4329 72.2 81.5609 74.299 80.6749C75.0787 80.3452 75.7441 79.7931 76.2122 79.0877C76.6803 78.3822 76.9302 77.5545 76.931 76.7079V32.1299C76.931 30.7605 77.4749 29.4472 78.4431 28.4788C79.4113 27.5103 80.7245 26.9662 82.0939 26.9659H90.701C92.0706 26.9659 93.384 27.51 94.3525 28.4784C95.3209 29.4468 95.865 30.7603 95.865 32.1299V68.8389C103.327 63.4309 110.889 56.9269 116.89 49.1059C117.761 47.9707 118.337 46.6377 118.567 45.2257C118.797 43.8138 118.674 42.3668 118.209 41.0139C115.431 33.0217 111.016 25.6973 105.245 19.5096C99.474 13.3218 92.4749 8.40687 84.6955 5.07934C76.9161 1.75182 68.5277 0.0849617 60.0671 0.185439C51.6065 0.285917 43.2601 2.15152 35.562 5.66286C27.8638 9.17419 20.9834 14.2539 15.3611 20.577C9.73881 26.9001 5.49842 34.3272 2.91131 42.3832C0.324207 50.4391 -0.552649 58.9464 0.336851 67.3607C1.22635 75.775 3.86263 83.911 8.07696 91.2479C8.81111 92.5135 9.89118 93.5434 11.1903 94.2165C12.4894 94.8896 13.9536 95.178 15.411 95.0479C17.039 94.9049 19.066 94.7019 21.476 94.4189C22.5251 94.2998 23.4937 93.7989 24.1972 93.0116C24.9008 92.2244 25.2901 91.2058 25.291 90.1499L25.29 57.9139Z"
        fill={color}
      />
      <path
        d="M25.1021 110.009C34.1744 116.609 44.8959 120.571 56.0802 121.456C67.2646 122.34 78.4757 120.114 88.4731 115.022C98.4705 109.93 106.864 102.172 112.726 92.6059C118.587 83.0395 121.688 72.0381 121.685 60.8188C121.685 59.4188 121.62 58.0337 121.527 56.6567C99.308 89.7947 58.2831 105.287 25.104 110.004"
        fill={color}
      />
    </Icon>
  );
}
