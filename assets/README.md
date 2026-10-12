# Media assets

Drop photos and videos here, then point the page at them.

## How the placeholders work

Every image/video slot in `index.html` is a box with a `data-media="..."` label.
The current `data-media` values are:

| data-media       | Where it appears                 | Suggested size            |
|------------------|----------------------------------|---------------------------|
| `hero`           | Big hero banner                  | 1600×700 (landscape)      |
| `akhila`         | Akhila's portrait                | 900×1200 (portrait)       |
| `naresh`         | Naresh's portrait                | 900×1200 (portrait)       |
| `show-essp`      | Enna Solla Pogiraai?? poster     | 1000×750                  |
| `show-nesippaya` | Nesippaya poster                 | 1000×750                  |
| `clip-1/2/3`     | Short video clips (See Us Live)  | vertical 9:14             |
| `g1`–`g6`        | Gallery grid                     | mixed                     |

## Swapping a placeholder for a real photo

Find the box in `index.html`, e.g.:

```html
<div class="performer-photo" data-media="akhila">
  <span class="media-label">Akhila — portrait</span>
</div>
```

Replace the inner `<span>` with an `<img>`:

```html
<div class="performer-photo" data-media="akhila">
  <img src="assets/akhila.jpg" alt="Akhila performing" />
</div>
```

(You can also remove the `data-media` attribute once a real image is in — it only
draws the dotted placeholder pattern.)

## Adding a video clip

Replace a clip box with a `<video>` or a YouTube embed:

```html
<!-- local file -->
<div class="clip">
  <video src="assets/clip-1.mp4" controls playsinline></video>
</div>

<!-- or YouTube -->
<div class="clip">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID"
          title="Live clip" allowfullscreen
          style="width:100%;height:100%;border:0"></iframe>
</div>
```
