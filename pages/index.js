"use strict";

import Image from "next/image";
import Link from "next/link";
import {Header} from '../components/header.js';

export default function Home() {
  return (
    <div className="container">
      {Header()}
      <div className="container-flex">
        <div className="container-inner">
          <Link href="/streaming">
            <a>
              <Image
                src="/matrix_world_1200.jpg"
                alt="Picture of Matrix and world map"
                objectFit="cover"
                layout="fill"
                priority
              />
              <div className="centered">Streaming</div>
            </a>
          </Link>
        </div>
        <div className="container-inner">
          <Link href="/library">
            <a>
              <Image
                src="/book_1276.jpg"
                alt="Picture of Matrix and world map"
                objectFit="cover"
                layout="fill"
                priority
              />
              <div className="centered">Library</div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
