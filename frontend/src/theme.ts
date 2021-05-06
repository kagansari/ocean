import { createGlobalStyle } from "styled-components";

const spaces = [0, 1, 2, 3, 4, 5, 10, 15, 16, 20, 25, 30, 40, 45, 50];
const heights = [50, 75, 100, 125, 150, 175, 200, 250, 500, 750, 1000, 1500];
export const GlobalStyle = createGlobalStyle`
  .block {
    display: block;
  }

  .inline {
    display: inline-block;
  }

  .flex {
    display: flex;
    &.inline {
    display: inline-flex;
    }

    &.center {
      justify-content: center;
      align-items: center;
    }

    &.spread {
      justify-content: space-between;
    }

    &.column {
      flex-direction: column;
    }
  }
  
  .nowrap {
    white-space: nowrap !important;
  }

  .no-wrap {
    flex-wrap: nowrap !important;
  }

  .grow {
    flex-grow: 1;
  }

  .h-100p {
    height: 100%
  }

  .w-100p {
    width: 100% !important
  }

  .w-50p {
    width: 50% !important
  }

  .text-left {
    text-align: left !important;
  }

  .text-right {
    text-align: right !important;
  }

  .text-center {
    text-align: center !important;
  }

  .text-upper {
    text-transform: uppercase !important;
  }

  .text-bold {
    font-weight: bold !important;
  }

  .text-pale {
    color: rgba(255,255,255, 0.5);
  }

  .text-white {
    color: white !important;
  }

  .text-grey {
    color: #eee !important;
  }
 
  .fs-10 {
    font-size: 10px !important;
  }

  .fs-12 {
    font-size: 12px !important;
  }
  .fs-13 {
    font-size: 13px !important;
  }
  .fs-14 {
    font-size: 14px !important;
  }

  .fs-16 {
    font-size: 16px !important;
  }

  .fs-18 {
    font-size: 18px !important;
  }

  .fs-20 {
    font-size: 20px !important;
  }

  .fs-22 {
    font-size: 22px !important;
  }

  .fs-24 {
    font-size: 24px !important;
  }

  .fs-26 {
    font-size: 24px !important;
  }

  .fs-28 {
    font-size: 24px !important;
  }

  .fs-32 {
    font-size: 24px !important;
  }

  .fs-36 {
    font-size: 24px !important;
  }

  .ellipsis {
    min-width: 0;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .opacity-75 {
    opacity: 0.75
  }

  .opacity-50 {
    opacity: 0.5
  }

  .opacity-25 {
    opacity: 0.25
  }

  .z-1000 {
    z-index: 1000;
  }

  .w-100 {
    width: 100px;
  }

  .w-150 {
    width: 150px;
  }

  .w-200 {
    width: 200px;
  }

  .w-250 {
    width: 250px;
  }

  .w-300 {
    width: 300px;
  }
  .w-500 {
    width: 500px;
  }


  .max-w-100 {
    max-width: 100px;
  }

  .max-w-200 {
    max-width: 200px;
  }

  .max-w-250 {
    max-width: 250px;
  }

  .max-w-300 {
    max-width: 300px;
  }

  .h-10 {
    height: 10px;
  }

  .h-20 {
    height: 20px;
  }
  .h-25 {
    height: 25px;
  }

  .h-30 {
    height: 30px;
  }

  .h-40 {
    height: 40px;
  }

  .h-50 {
    height: 50px;
  }

  .l-10 {
    line-height: 10px;
  }

  .l-20 {
    line-height: 20px;
  }

  .l-30 {
    line-height: 30px;
  }

  .l-40 {
    line-height: 40px;
  }

  .l-50 {
    line-height: 50px;
  }

  // Example usage: mh-50, mh-125
  ${heights.map(
    h => `
    .mh-${h} {
      max-height: ${h}px;
      overflow: hidden;
    }
    `
  )}
    // Example usage: p-0, pt-15, m-40, mb-0
  ${spaces.map(
    s => `
    .p-${s} { padding: ${s}px !important; }
    .pt-${s} { padding-top: ${s}px !important; }
    .pr-${s} { padding-right: ${s}px !important; }
    .pb-${s} { padding-bottom: ${s}px !important; }
    .pl-${s} { padding-left: ${s}px !important; }
    .px-${s} { padding-left: ${s}px !important; padding-right: ${s}px !important; }
    .py-${s} { padding-top: ${s}px !important; padding-bottom: ${s}px !important; }
    .m-${s} { margin: ${s}px !important; }
    .mt-${s} { margin-top: ${s}px !important; }
    .mr-${s} { margin-right: ${s}px !important; }
    .mb-${s} { margin-bottom: ${s}px !important; }
    .ml-${s} { margin-left: ${s}px !important; }
    .mx-${s} { margin-left: ${s}px !important; margin-right: ${s}px !important; }
    .my-${s} { margin-top: ${s}px !important; margin-bottom: ${s}px !important; }
  `
  )}
  //.ant-layout {
  //  background-color: #f6f7f7 !important;
  //}

  .bg-grey {
    background-color: #fafafa;
  }

  .ant-card {
    transition: background 500ms ease, box-shadow 500ms ease;

    &.bg-grey1 {
      background: #8e9eab; /* fallback for old browsers */
      background: -webkit-linear-gradient(to bottom right, #a3b2bf, #ced9db);
      background: linear-gradient(to bottom right, #a3b2bf, #ced9db);
    }

    &.bg-green {
      background: #76b852; /* fallback for old browsers */
      background: -webkit-linear-gradient(to bottom right, #76b852, #94cc74);
      background: linear-gradient(to bottom right, #76b852, #94cc74);
    }

    &.bg-blue {
      background: #00B4DB; /* fallback for old browsers */
      background: -webkit-linear-gradient(to bottom right, #0083B0, #00B4DB);
      background: linear-gradient(to bottom right, #0083B0, #00B4DB);
    }

    &.bg-cyan {
      background: #02AAB0; /* fallback for old browsers */
      background: -webkit-linear-gradient(to bottom right, #02AAB0, #00CDAC);
      background: linear-gradient(to bottom right, #02AAB0, #00CDAC);
    }

    &.bg-red {
      background: #ED213A; /* fallback for old browsers */
      background: -webkit-linear-gradient(to bottom right, #93291E, #ED213A);
      background: linear-gradient(to bottom right, #93291E, #ED213A);
    }

    &.bg-orange {
      background: #FFE000; /* fallback for old browsers */
      background: -webkit-linear-gradient(to bottom right, #fa8c16, #FFE000);
      background: linear-gradient(to bottom right, #fa8c16, #FFE000);
    }

    &.bg-purple {
      background: #DA4453; /* fallback for old browsers */
      background: -webkit-linear-gradient(to bottom right, #89216B, #DA4453); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(to bottom right, #89216B, #DA4453); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
  }

  tr {
    .bg-blue {
      background-color: #f0f5ff !important;
    }

    &:hover .bg-blue {
      background-color: #d6e4ff !important;
    }

    .bg-red {
      background-color: #fff1f0 !important;
    }

    &:hover .bg-red {
      background-color: #ffccc7 !important;
    }

    .bg-orange {
      background-color: #fff7e6 !important;
    }

    &:hover .bg-orange {
      background-color: #ffe7ba !important;
    }

    .bg-yellow {
      background-color: #feffe6 !important;
    }

    &:hover .bg-yellow {
      background-color: #ffffb8 !important;
    }
  }

  h3.pale {
    color: rgb(0, 0, 0, 0.5);
    margin: 0;
  }

  .ant-card.bg-grey {
    background-color: rgb(250, 250, 250);
  }

  .ant-card.h-100p .ant-card-body {
    height: 100%;
  }

  .ant-card.p-0 .ant-card-body {
    padding: 0;
  }
  .ant-card.p-12 .ant-card-body {
    padding: 12px;
  }

  .ant-card-hoverable.text-center {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .ant-card.rounded {
    border-radius: 5px;
  }

  .ant-card.top-rounded {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .ant-card.bottom-rounded {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .right-part {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .left-part {
    border-top-right-radius: 0 !important;;
    border-bottom-right-radius: 0 !important;;
  }

  .ant-upload {
    width: 100% !important;
  }

  .ant-card.blue {
    border-top: 4px solid #adc6ff;
  }

  .ant-card.red {
    border-top: 4px solid #ff7875;
  }

  .ant-card.green {
    border-top: 4px solid #b7eb8f;
  }

  .ant-card.orange {
    border-top: 4px solid #ffd591;
  }

  .ant-card.purple {
    border-top: 4px solid #DA4453;
  }

  .ant-card.cyan {
    border-top: 4px solid #02AAB0;
  }
  .ant-card.cyan-bottom {
    
    border-bottom: 4px solid #02AAB0;
  }
  .ant-header .cyan-bottom {
    border-bottom: 4px solid #02AAB0;
  }

  .ant-card.widget {
    top: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;

    .ant-card-head {
      min-height: 65px;
      height: 65px;
    }

    .ant-card-body {
      flex-grow: 1;

      .ant-empty {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }

    .ant-card-cover {
      overflow: hidden;
    }

    .ant-card-actions {
      li {
        padding: 0 5px;

        & > span {
          cursor: default;

          .anticon:hover {
            color: rgb(0, 0, 0, 0.5);
          }
        }
      }

      h4 {
        color: rgb(0, 0, 0, 0.5);
      }
    }
  }

  .ant-card.image {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .ant-card.tab-head {
    .ant-card-body {
      padding: 0;
    }

    .ant-tabs .ant-tabs-nav {
      margin: 0;

      .ant-tabs-nav-list {
        margin-left: 16px;
      }
    }
  }

  .ant-collapse {
    .ant-collapse-content-box {
      padding: 0 !important;
    }
  }

  .ant-drawer {
    &.tab-head {
      .ant-tabs .ant-tabs-nav {
        margin: 0;

        .ant-tabs-nav-list {
          margin-left: 16px;
        }
      }
    }

    &.p-0 {
      & > .ant-drawer-content-wrapper > .ant-drawer-content > .ant-drawer-wrapper-body > .ant-drawer-body {
        padding: 0;
      }
    }

    &.bg-grey {
      background-color: initial;

      & > .ant-drawer-content-wrapper > .ant-drawer-content > .ant-drawer-wrapper-body {
        background-color: #fafafa;
      }
    }
  }

  .ant-tabs.m-0 > .ant-tabs-nav {
    margin-bottom: 0;
  }

  .ant-modal.p-0 {
    .ant-modal-body {
      padding: 0;
    }

    .ant-tabs .ant-tabs-nav {
      margin: 0;

      .ant-tabs-nav-list {
        margin-left: 16px;
      }
    }
  }

  .ant-modal-body > .ant-steps > .ant-steps-item {
    padding-bottom: 16px;
  }

  .ant-popover .ant-popover-inner-content .ant-popover-buttons {
    white-space: nowrap;
  }

  .ant-btn.ant-btn-link.red {
    color: #cf1322;
  }

  .ant-btn.ant-btn-link.grey {
    color: inherit;
  }

  .ant-card, .fade-container {
    transition: opacity 250ms ease;

    .ant-btn.ant-btn-text.ant-btn-icon-only.fade {
      opacity: 0;
    }

    .ant-btn.ant-btn-text.ant-btn-icon-only {
      opacity: .5;
    }

    &:hover {
      .ant-btn.ant-btn-text.ant-btn-icon-only.fade {
        opacity: 1;
      }

      .ant-btn.ant-btn-text.ant-btn-icon-only {
        opacity: 1;
      }
    }
  }

  .ant-table-wrapper.excel-footer * .ant-table-footer {
    padding: 0 !important;

    .excel-button {
      position: absolute;
      margin: 7px;
    }
  }

  .width-trans {
    transition: width 300ms ease, max-width 300ms ease;
  }

  .up.ant-progress .ant-progress-text {
    margin-top: -8px;
  }

  .text-white.ant-progress .ant-progress-text {
    color: white !important;
  }

  .text-large.ant-progress .ant-progress-text {
    font-size: 24px;
  }

  .text-white.ant-statistic {
    .ant-statistic-title {
      color: #eee !important;
      opacity: .75;
      font-size: 12px;
      line-height: 14px;
      margin-bottom: 0;
    }

    .ant-statistic-content {
      color: white !important;
      font-size: 22px;
    }
  }
  
  .ant-table-row:hover {
    cursor: pointer;
  }
`;
