import { ComingSoonButton } from "@/components/common/ComingSoonButton";

const POLICY_LINKS = ["회사소개", "이용약관", "개인정보처리방침"];

const BUSINESS_REGISTRATION_NUMBER = "735-87-02522";

export function Footer() {
  return (
    <footer className="break-keep bg-white px-4 py-10 text-body-sm text-gray-200 md:px-[60px]">
      <div className="flex flex-col gap-2">
        <ul className="flex flex-wrap items-center gap-3">
          {POLICY_LINKS.map((label, index) => (
            <li key={label} className="flex items-center gap-3">
              {index > 0 && <span aria-hidden>|</span>}
              <ComingSoonButton featureName={label} className="transition-colors duration-200 hover:text-gray-500">
                {label}
              </ComingSoonButton>
            </li>
          ))}
        </ul>
        <address className="not-italic">
          <p>
            (주)히든카이스 | 대표: 안영호 | 사업자등록번호:{" "}
            <span className="whitespace-nowrap">{BUSINESS_REGISTRATION_NUMBER}</span> (
            <a
              href={`https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${BUSINESS_REGISTRATION_NUMBER.replaceAll("-", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors duration-200 hover:text-gray-500"
            >
              사업자정보확인
            </a>
            )
          </p>
          <p>
            주소: 경기도 고양시 일산서구 일현로 97-11, 56F | 통신판매업신고: 제 2024-고양일산서-1209 | 이메일:
            Hidden_kice@naver.com
          </p>
        </address>
        <p>Copyright © 2026 히든카이스. All rights reserved.</p>
      </div>
    </footer>
  );
}
