"use strict";

import Image from "next/image";
import Link from "next/link";
import MatrixImage from "../public/matrix_world_1200.jpg";
import BookImage from "../public/book_1276.jpg";

export default function Home() {
  return (
    <div className="container">
      
      <div className="container-flex">
        <div className="container-inner">
          <Link href="/streaming">
            <a>
              <Image
                src={MatrixImage}
                alt="Picture of Matrix and world map"
                objectFit="cover"
                layout="fill"
                priority
                placeholder="blur"
              />
              <div className="centered">Streaming</div>
            </a>
          </Link>
        </div>
        <div className="container-inner">
          <Link href="/library">
            <a>
              <Image
                src={BookImage}
                alt="Picture of book"
                objectFit="cover"
                layout="fill"
                priority
                placeholder="blur"
              />
              <div className="centered">Library</div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}