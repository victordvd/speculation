package com.sp.config;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManagerFactory;

import org.springframework.context.annotation.Bean;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.support.SharedEntityManagerBean;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaDialect;
import org.springframework.orm.jpa.vendor.EclipseLinkJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

//@Configuration
//@EnableTransactionManagement
public class PersistenceConfig {

	@Bean
	public DriverManagerDataSource setXEdataSource() {
		DriverManagerDataSource dmsd = new DriverManagerDataSource();

		dmsd.setDriverClassName("oracle.jdbc.OracleDriver");
		dmsd.setUrl("jdbc:oracle:thin:@localhost:1521:XE");
		dmsd.setUsername("system");
		dmsd.setPassword("fcop");

		return dmsd;
	}

	@Bean
	public EclipseLinkJpaDialect eclipseLinkJpaDialect() {
		return new EclipseLinkJpaDialect();
	}

	@Bean
	public EntityManagerFactory entityManagerFactory() {

		LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
		EclipseLinkJpaVendorAdapter adapter = new EclipseLinkJpaVendorAdapter();
		adapter.setGenerateDdl(true);

		Map<String, Object> jpaProperties = new HashMap<String, Object>();
		jpaProperties.put("eclipselink.weaving", "false");
		jpaProperties.put("eclipselink.logging.parameters", "true");
		jpaProperties.put("eclipselink.logging.level", "INFO");

		factory.setJpaPropertyMap(jpaProperties);
		factory.setJpaVendorAdapter(adapter);
		factory.setPackagesToScan("com.sp.entity");
		factory.setDataSource(setXEdataSource());
		factory.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
		factory.setJpaDialect(new EclipseLinkJpaDialect());

		factory.afterPropertiesSet();

		return factory.getObject();
	}

	@Bean
	public SharedEntityManagerBean entityManager() {
		SharedEntityManagerBean semb = new SharedEntityManagerBean();

		semb.setEntityManagerFactory(entityManagerFactory());

		return semb;
	}

	@Bean
	public PlatformTransactionManager txManager() {
		return new JpaTransactionManager(entityManagerFactory());
	}

}
