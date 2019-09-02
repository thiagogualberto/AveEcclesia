<?php
namespace Sistema;

class Date {

	static $locale = 'pt-BR';

	public static function setLocale(string $locale) {
		static::$locale = $locale;
	}

	public static function toFullString(\DateTime $date = null)
	{
		$del = ' de '; // Delimitador

		if (is_null($date)) {
			$date = new \DateTime;
		}

		$date = $date->format('Y-m-d H:i:s');
		$date = preg_replace('/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}).*/', '$3-$2-$1-$4-$5', $date);

		list($dia, $mes, $ano, $hora, $minuto) = explode('-', $date);

		return $dia.$del.static::month_string($mes).$del.$ano;
	}

	public static function toString(\DateTime $date = null) {
		if ($date !== null) {
			return $date->format('d/m/Y');
		} else {
			return $date;
		}
	}

	public static function age(\DateTime $date) {
		return $date->diff(new \DateTime())->format('%Y');
	}

	private static function locale_month($date)
	{
		$date = is_string($date) ? strtotime($date) : $date;
		$num = intval(date('m', $date));

		return static::month_string($num);
	}

	private static function month_string($num)
	{
		$meses = [];

		switch (static::$locale) {
			case 'pt-BR':
				$meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
			default:
				break;
		}

		return $meses[$num-1];
	}
}