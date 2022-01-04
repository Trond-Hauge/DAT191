"use strict";

import Image from "next/image";
import Link from "next/link";
import { HeaderComponent } from "../src/snippets";

export default function Home() {
  return (
    <div className="container">
      {/* HEADER START*/}
      <div className="navbar">
        <div className="nav-container-left">
          <ul className="nav-left">
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>

        <div className="nav-container-right">
          <ul className="nav-right">
            <a>Sign In</a>
          </ul>
        </div>
      </div>
      {/* HEADER END*/}

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
          <Image
            src="/book_1276.jpg"
            alt="Picture of Matrix and world map"
            objectFit="cover"
            layout="fill"
            priority
          />
          <div className="centered">Library</div>
        </div>
      </div>
    </div>
  );
}
