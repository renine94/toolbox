'use client'

import { useState, useMemo } from 'react'

// ─── 달력 유틸리티 ─────────────────────────────────────────
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// ─── 시간 슬롯 데이터 ──────────────────────────────────────
const TIME_SLOTS = [
  ['11:30', '12:00', '12:30', '13:00'],
  ['17:30', '18:00', '18:30', '19:00'],
]

// ─── 메인 페이지 컴포넌트 ─────────────────────────────────
export default function ReservationPage() {
  // 날짜 관련 상태
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(1) // 0-indexed (1 = 2월)
  const [selectedDate, setSelectedDate] = useState(9)

  // 시간 선택
  const [selectedTime, setSelectedTime] = useState('18:00')

  // 인원 수
  const [guestCount, setGuestCount] = useState(4)

  // 예약자 정보
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [request, setRequest] = useState('')

  // 달력 데이터 계산
  const calendarData = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const weeks: (number | null)[][] = []
    let week: (number | null)[] = Array(firstDay).fill(null)

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }

    // 마지막 주 빈 칸 채우기
    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      weeks.push(week)
    }

    return weeks
  }, [currentYear, currentMonth])

  // 월 이동
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDate(0)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDate(0)
  }

  // 인원 수 조절
  const decreaseGuest = () => setGuestCount((prev) => Math.max(1, prev - 1))
  const increaseGuest = () => setGuestCount((prev) => Math.min(20, prev + 1))

  // 예약 확인
  const handleSubmit = () => {
    const monthStr = `${currentYear}년 ${currentMonth + 1}월 ${selectedDate}일`
    alert(
      `예약 정보:\n날짜: ${monthStr}\n시간: ${selectedTime}\n인원: ${guestCount}명\n이름: ${name}\n연락처: ${phone}\n요청사항: ${request}`
    )
  }

  const DAY_HEADERS = [
    { label: '일', color: 'text-red-500' },
    { label: '월', color: 'text-gray-500' },
    { label: '화', color: 'text-gray-500' },
    { label: '수', color: 'text-gray-500' },
    { label: '목', color: 'text-gray-500' },
    { label: '금', color: 'text-gray-500' },
    { label: '토', color: 'text-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* ── 상단 네비게이션 ── */}
      <header className="flex h-14 items-center gap-4 bg-white px-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => window.history.back()}
          className="text-xl font-bold text-[#1A1A26] transition-colors hover:text-[#3B59F5]"
        >
          ←
        </button>
        <span className="text-lg font-bold text-[#1A1A26]">테이블 예약</span>
      </header>

      {/* ── 콘텐츠 ── */}
      <main className="mx-auto flex max-w-[1440px] gap-8 px-12 py-8">
        {/* ── 좌측: 날짜/시간 선택 ── */}
        <div className="flex-1 rounded-2xl bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          {/* 날짜 선택 제목 */}
          <h2 className="mb-6 text-base font-bold text-[#1A1A26]">날짜 선택</h2>

          {/* 달력 헤더 */}
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="text-sm font-medium text-[#737380] transition-colors hover:text-[#1A1A26]"
            >
              ◀
            </button>
            <span className="text-[15px] font-semibold text-[#1A1A26]">
              {currentYear}년 {currentMonth + 1}월
            </span>
            <button
              onClick={handleNextMonth}
              className="text-sm font-medium text-[#737380] transition-colors hover:text-[#1A1A26]"
            >
              ▶
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="mb-1 grid grid-cols-7">
            {DAY_HEADERS.map((day) => (
              <div
                key={day.label}
                className={`flex h-8 items-center justify-center text-[13px] font-medium ${day.color}`}
              >
                {day.label}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="mb-6 grid gap-1">
            {calendarData.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7">
                {week.map((day, dayIdx) => (
                  <button
                    key={dayIdx}
                    disabled={day === null}
                    onClick={() => day && setSelectedDate(day)}
                    className={`flex h-10 items-center justify-center rounded-lg text-sm transition-colors ${
                      day === null
                        ? 'cursor-default'
                        : day === selectedDate
                          ? 'bg-[#3B59F5] font-bold text-white'
                          : 'text-[#1A1A26] hover:bg-[#F0F0F5]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* 시간 선택 제목 */}
          <h2 className="mb-4 text-base font-bold text-[#1A1A26]">시간 선택</h2>

          {/* 시간 슬롯 */}
          <div className="flex flex-col gap-2.5">
            {TIME_SLOTS.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-4 gap-2.5">
                {row.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex h-[41px] items-center justify-center rounded-[10px] text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? 'bg-[#3B59F5] font-semibold text-white'
                        : 'bg-[#F7F7FA] text-[#1A1A26] hover:bg-[#EDEDF2]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── 우측: 예약 정보 ── */}
        <div className="flex flex-1 flex-col gap-7 rounded-2xl bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          {/* 인원 선택 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#1A1A26]">인원 선택</h2>
            <div className="flex items-center justify-center gap-0">
              <button
                onClick={decreaseGuest}
                className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#F7F7FA] text-[22px] font-medium text-[#1A1A26] transition-colors hover:bg-[#EDEDF2]"
              >
                −
              </button>
              <div className="flex w-20 items-center justify-center">
                <span className="text-[28px] font-bold text-[#1A1A26]">
                  {guestCount}
                </span>
              </div>
              <button
                onClick={increaseGuest}
                className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#F7F7FA] text-[22px] font-medium text-[#1A1A26] transition-colors hover:bg-[#EDEDF2]"
              >
                +
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-[#E0E0E5]" />

          {/* 예약자 정보 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-[#1A1A26]">예약자 정보</h2>

            {/* 이름 */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#737380]">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예약자 이름을 입력하세요"
                className="h-[45px] rounded-[10px] bg-[#F7F7FA] px-4 text-sm text-[#1A1A26] outline-none placeholder:text-[#B2B2B8] focus:ring-2 focus:ring-[#3B59F5]"
              />
            </div>

            {/* 연락처 */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#737380]">
                연락처
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="h-[45px] rounded-[10px] bg-[#F7F7FA] px-4 text-sm text-[#1A1A26] outline-none placeholder:text-[#B2B2B8] focus:ring-2 focus:ring-[#3B59F5]"
              />
            </div>

            {/* 요청사항 */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-[#737380]">
                요청사항
              </label>
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="특별한 요청사항이 있으시면 입력하세요"
                className="h-[100px] resize-none rounded-[10px] bg-[#F7F7FA] px-4 py-3 text-sm text-[#1A1A26] outline-none placeholder:text-[#B2B2B8] focus:ring-2 focus:ring-[#3B59F5]"
              />
            </div>
          </div>

          {/* 예약 확인 버튼 */}
          <button
            onClick={handleSubmit}
            className="mt-auto flex h-[57px] items-center justify-center rounded-xl bg-[#3B59F5] text-[17px] font-bold text-white transition-colors hover:bg-[#2D47D9] active:bg-[#2540C4]"
          >
            예약 확인
          </button>
        </div>
      </main>
    </div>
  )
}
